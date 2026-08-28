import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  Home,
  LayoutGrid,
  MessageSquare,
  Plus,
  Search,
  Settings as SettingsIcon,
  Target,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/lib/settings';
import StudyChat from '@/components/StudyChat';
import NewsSection from '@/components/NewsSection';
import ReadingView from '@/components/ReadingView';
import MessagesView from '@/components/MessagesView';
import SettingsView from '@/components/SettingsView';
import SchoolTasks, { type AgendaItem } from '@/components/SchoolTasks';
import NotesView from '@/components/NotesView';

type View = 'inicio' | 'tareas' | 'agenda' | 'notas' | 'lectura' | 'mensajes' | 'ajustes';
type Priority = 'low' | 'medium' | 'high';

type PlanningTask = {
  id: string;
  title: string;
  details: string;
  category: string;
  due_date: string | null;
  priority: Priority;
  completed: boolean;
  created_at: string;
};

const starterTasks: PlanningTask[] = [
  { id: 'starter-1', title: 'Revisar objetivos de la semana', details: 'Definir las tres prioridades que mueven el proyecto.', category: 'Trabajo', due_date: new Date().toISOString().slice(0, 10), priority: 'high', completed: false, created_at: new Date().toISOString() },
  { id: 'starter-2', title: 'Preparar presentación del viernes', details: 'Ordenar las ideas principales y añadir ejemplos.', category: 'Trabajo', due_date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), priority: 'medium', completed: false, created_at: new Date().toISOString() },
  { id: 'starter-3', title: 'Bloque de concentración', details: '45 minutos sin notificaciones para avanzar.', category: 'Personal', due_date: new Date(Date.now() + 172800000).toISOString().slice(0, 10), priority: 'low', completed: true, created_at: new Date().toISOString() },
];

const navItems: { id: View; labelKey: string; icon: typeof Home }[] = [
  { id: 'inicio', labelKey: 'nav.inicio', icon: Home },
  { id: 'tareas', labelKey: 'nav.tareas', icon: ClipboardList },
  { id: 'agenda', labelKey: 'nav.agenda', icon: CalendarDays },
  { id: 'notas', labelKey: 'nav.notas', icon: FileText },
  { id: 'lectura', labelKey: 'nav.lectura', icon: BookOpen },
];

function App() {
  const { t, profile } = useSettings();
  const [view, setView] = useState<View>('inicio');
  const [tasks, setTasks] = useState<PlanningTask[]>(starterTasks);
  const [search, setSearch] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [addPersonalTrigger, setAddPersonalTrigger] = useState(0);
  const [addNoteTrigger, setAddNoteTrigger] = useState(0);
  const [schoolAgendaItems, setSchoolAgendaItems] = useState<AgendaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      const { data, error } = await supabase.from('planning_tasks').select('*').order('created_at', { ascending: false });
      if (error) {
        setErrorMessage('No pudimos actualizar tus tareas. Puedes seguir organizándote y volver a intentarlo.');
      } else if (data && data.length > 0) {
        setTasks(data as PlanningTask[]);
      }
      setIsLoading(false);
    };
    void loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tasks;
    return tasks.filter((task) => `${task.title} ${task.category} ${task.details}`.toLowerCase().includes(query));
  }, [search, tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeTasks = filteredTasks.filter((task) => !task.completed);
  const todayLabel = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  const toggleTask = async (task: PlanningTask) => {
    const completed = !task.completed;
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed } : item));
    if (!task.id.startsWith('starter-')) {
      const { error } = await supabase.from('planning_tasks').update({ completed }).eq('id', task.id);
      if (error) setErrorMessage('No pudimos guardar ese cambio.');
    }
  };

  return (
    <main className="app-shell">
      <section className="planner-frame">
        <header className="hero">
          <div className="hero-topline">
            <div>
              <span className="eyebrow">{t('hero.espacio')}</span>
              <h1>{t('hero.hola')}, {profile.name.split(' ')[0]}<span>!</span></h1>
              <p>{todayLabel}</p>
            </div>
            <button className="profile-button" aria-label="Abrir perfil" style={{ background: profile.avatarColor, color: '#fff', fontSize: 16, fontWeight: 700 }}>{profile.initials}</button>
          </div>
          <label className="search-box">
            <Search size={19} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('hero.buscar')} />
            {search && <button type="button" onClick={() => setSearch('')} aria-label="Limpiar búsqueda"><X size={16} /></button>}
          </label>
        </header>

        <div className="content-area">
          <nav className="section-nav" aria-label="Secciones de planificación">
            {navItems.map(({ id, labelKey, icon: Icon }) => (
              <button className={`section-nav-item ${view === id ? 'active' : ''}`} onClick={() => setView(id)} key={id}>
                <Icon size={25} strokeWidth={1.8} />
                <span>{t(labelKey)}</span>
              </button>
            ))}
          </nav>

          {errorMessage && <div className="notice"><span>{errorMessage}</span><button onClick={() => setErrorMessage('')} aria-label="Cerrar aviso"><X size={16} /></button></div>}

          {view === 'inicio' && (
            <div className="view-content fade-in">
              <div className="greeting-row"><div><span className="section-kicker">{t('inicio.paraTi')}</span><h2>{t('inicio.tuDia')}</h2></div><button className="icon-button" aria-label="Notificaciones"><Bell size={20} /></button></div>
              <div className="focus-card">
                <div><span className="card-label">{t('inicio.enfoque')}</span><strong>{activeTasks.length ? activeTasks[0].title : 'Tu agenda está despejada'}</strong><p>{activeTasks.length ? 'Un paso pequeño hace avanzar todo.' : 'Es un buen momento para planear algo nuevo.'}</p></div>
                <div className="focus-orbit"><Target size={25} /></div>
              </div>
              <div className="dashboard-grid">
                <button className="agenda-card" onClick={() => setView('agenda')}><div className="card-icon orange"><CalendarDays size={21} /></div><span>{t('inicio.agenda')}</span><strong>{tasks.filter((task) => task.due_date).length} {t('inicio.eventos')}</strong><ChevronRight size={18} /></button>
                <button className="notes-card" onClick={() => setView('notas')}><div className="card-icon pink"><FileText size={21} /></div><span>{t('inicio.notasRapidas')}</span><strong>{t('inicio.ideas')}</strong><ChevronRight size={18} /></button>
              </div>
              <div className="section-heading"><div><span className="section-kicker">{t('inicio.progreso')}</span><h2>{t('inicio.pendientes')}</h2></div><button className="text-button" onClick={() => setView('tareas')}>{t('inicio.verTodas')}</button></div>
              <div className="progress-card"><div className="progress-copy"><span>{t('inicio.estaSemana')}</span><strong>{completedCount}<small> / {tasks.length} {t('inicio.completadas')}</small></strong></div><div className="progress-ring" style={{ '--progress': `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` } as React.CSSProperties}><span>{tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%</span></div></div>
              <SchoolTasks addTrigger={addPersonalTrigger} onAgendaChange={setSchoolAgendaItems} />
              <NewsSection />
            </div>
          )}

          {view === 'tareas' && <div className="view-content fade-in"><PageTitle eyebrow={t('tareas.organizacion')} title={t('tareas.misTareas')} action={<button className="primary-action" onClick={() => setAddPersonalTrigger((n) => n + 1)}><Plus size={18} />{t('tareas.nuevaPlanificacion')}</button>} /><SchoolTasks addTrigger={addPersonalTrigger} onAgendaChange={setSchoolAgendaItems} /></div>}

          {view === 'agenda' && <div className="view-content fade-in"><PageTitle eyebrow={t('agenda.calendario')} title={t('agenda.titulo')} action={<button className="icon-button"><CalendarDays size={20} /></button>} /><div className="calendar-strip">{[0, 1, 2, 3, 4].map((offset) => { const date = new Date(); date.setDate(date.getDate() + offset); return <div className={`day-pill ${offset === 0 ? 'selected' : ''}`} key={offset}><span>{new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date).slice(0, 3)}</span><strong>{date.getDate()}</strong></div>; })}</div><div className="agenda-list">{[...filteredTasks.filter((task) => task.due_date).map((task) => ({ id: task.id, title: task.title, category: task.category, dueDate: task.due_date!, completed: task.completed })), ...schoolAgendaItems].sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((item) => <div className={`agenda-row ${item.completed ? 'done' : ''}`} key={item.id}><span className="agenda-time"><Clock3 size={15} />{formatDate(item.dueDate)}</span><div className="agenda-line" /><div><strong>{item.title}</strong><span>{item.category}</span></div></div>)}</div></div>}

          {view === 'notas' && <div className="view-content fade-in"><PageTitle eyebrow={t('notas.ideas')} title={t('notas.titulo')} action={<button className="primary-action" onClick={() => setAddNoteTrigger((n) => n + 1)}><Plus size={18} />{t('notas.nueva')}</button>} /><NotesView addTrigger={addNoteTrigger} /></div>}

          {view === 'lectura' && <ReadingView />}

          {view === 'mensajes' && <MessagesView />}

          {view === 'ajustes' && <SettingsView />}
        </div>

        <footer className="bottom-nav">
          <button className={view === 'inicio' ? 'selected' : ''} onClick={() => setView('inicio')}><Home size={22} /><span>{t('nav.inicio')}</span></button>
          <button onClick={() => setView('tareas')} className={view === 'tareas' ? 'selected' : ''}><LayoutGrid size={22} /><span>{t('nav.planificar')}</span></button>
          <button className="quick-add" onClick={() => setIsChatOpen(true)} aria-label="Nueva planificación"><Plus size={25} /></button>
          <button onClick={() => setView('mensajes')} className={view === 'mensajes' ? 'selected' : ''}><MessageSquare size={22} /><span>{t('nav.mensajes')}</span></button>
          <button onClick={() => setView('ajustes')} className={view === 'ajustes' ? 'selected' : ''}><SettingsIcon size={22} /><span>{t('nav.ajustes')}</span></button>
        </footer>
      </section>

      <StudyChat open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </main>
  );
}

function formatDate(date: string | null) {
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`));
}

function PageTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return <div className="page-title"><div><span className="section-kicker">{eyebrow}</span><h2>{title}</h2></div>{action}</div>;
}

function TaskList({ tasks, onToggle, loading, emptyMessage = 'Aún no tienes tareas pendientes.' }: { tasks: PlanningTask[]; onToggle: (task: PlanningTask) => void; loading: boolean; emptyMessage?: string }) {
  if (loading) return <div className="loading-card"><div className="loader" /><span>Cargando tu planificación...</span></div>;
  if (!tasks.length) return <div className="empty-card"><ClipboardList size={24} /><strong>{emptyMessage}</strong><span>Añade una tarea para empezar.</span></div>;
  return <div className="task-list">{tasks.map((task) => <button className={`task-row ${task.completed ? 'done' : ''}`} key={task.id} onClick={() => onToggle(task)}><span className={`check-circle ${task.completed ? 'checked' : ''}`}>{task.completed && <Check size={14} />}</span><span className="task-info"><strong>{task.title}</strong><span>{task.category} <i /> {formatDate(task.due_date)}</span></span><span className={`priority-dot ${task.priority}`} /></button>)}</div>;
}

export default App;
