import { useEffect, useState } from 'react';
import { Calendar, Check, ChevronRight, Paperclip, Plus, X } from 'lucide-react';

export type SubjectTask = {
  id: string;
  area: string;
  type: string;
  title: string;
  text: string;
  fileName: string | null;
  dueDate: string;
};

export type PersonalTask = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
};

export type AgendaItem = {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
};

const initialSubjects: SubjectTask[] = [
  { id: 'subject-1', area: 'COMUNICACIÓN', type: 'Poesía', title: '', text: '', fileName: null, dueDate: '' },
  { id: 'subject-2', area: 'RELIGIÓN', type: 'Ensayo', title: '', text: '', fileName: null, dueDate: '' },
];

const initialPersonalTasks: PersonalTask[] = [
  { id: 'personal-1', title: 'ESTUDIAR MATEMÁTICA', completed: false, dueDate: new Date().toISOString().slice(0, 10) },
  { id: 'personal-2', title: 'REPASAR HISTORIA', completed: false, dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10) },
  { id: 'personal-3', title: 'PREPARAR PRESENTACIÓN', completed: false, dueDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10) },
];

function isSubjectComplete(subject: SubjectTask): boolean {
  return subject.title.trim() !== '' && subject.text.trim() !== '' && subject.fileName !== null;
}

function SchoolTasks({ addTrigger = 0, onAgendaChange }: { addTrigger?: number; onAgendaChange?: (items: AgendaItem[]) => void }) {
  const [subjects, setSubjects] = useState<SubjectTask[]>(initialSubjects);
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>(initialPersonalTasks);
  const [activeSubject, setActiveSubject] = useState<SubjectTask | null>(null);
  const [draft, setDraft] = useState<SubjectTask | null>(null);
  const [isAddPersonalOpen, setIsAddPersonalOpen] = useState(false);
  const [newPersonal, setNewPersonal] = useState({ title: '', dueDate: new Date().toISOString().slice(0, 10) });
  const [editingPersonalId, setEditingPersonalId] = useState<string | null>(null);
  const [editingPersonalDate, setEditingPersonalDate] = useState('');

  useEffect(() => {
    if (addTrigger > 0) setIsAddPersonalOpen(true);
  }, [addTrigger]);

  useEffect(() => {
    if (!onAgendaChange) return;
    const subjectItems: AgendaItem[] = subjects
      .filter((s) => s.dueDate)
      .map((s) => ({ id: s.id, title: s.title || `${s.area}: ${s.type}`, category: s.area, dueDate: s.dueDate, completed: isSubjectComplete(s) }));
    const personalItems: AgendaItem[] = personalTasks
      .filter((t) => t.dueDate)
      .map((t) => ({ id: t.id, title: t.title, category: 'Personal', dueDate: t.dueDate, completed: t.completed }));
    onAgendaChange([...subjectItems, ...personalItems]);
  }, [subjects, personalTasks, onAgendaChange]);

  const openSubject = (subject: SubjectTask) => {
    setActiveSubject(subject);
    setDraft({ ...subject });
  };

  const saveSubject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    setSubjects((current) => current.map((s) => s.id === draft.id ? draft : s));
    setActiveSubject(null);
    setDraft(null);
  };

  const togglePersonal = (id: string) => {
    setPersonalTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && draft) {
      setDraft({ ...draft, fileName: file.name });
    }
  };

  const updatePersonalDate = (id: string, newDate: string) => {
    setPersonalTasks((current) => current.map((task) => task.id === id ? { ...task, dueDate: newDate } : task));
  };

  const startEditDate = (task: PersonalTask) => {
    setEditingPersonalId(task.id);
    setEditingPersonalDate(task.dueDate);
  };

  const saveEditDate = () => {
    if (editingPersonalId) {
      updatePersonalDate(editingPersonalId, editingPersonalDate);
    }
    setEditingPersonalId(null);
    setEditingPersonalDate('');
  };

  const addPersonalTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newPersonal.title.trim()) return;
    setPersonalTasks((current) => [...current, { id: `personal-${Date.now()}`, title: newPersonal.title.trim(), completed: false, dueDate: newPersonal.dueDate }]);
    setNewPersonal({ title: '', dueDate: new Date().toISOString().slice(0, 10) });
    setIsAddPersonalOpen(false);
  };

  const completedPersonal = personalTasks.filter((task) => task.completed).length;

  return (
    <div className="school-tasks">
      <div className="subject-cards">
        {subjects.map((subject) => {
          const complete = isSubjectComplete(subject);
          return (
            <button className="subject-card" key={subject.id} onClick={() => openSubject(subject)}>
              <div className="subject-card-top">
                <div className="subject-card-header">
                  <span className="subject-area">{subject.area}</span>
                  <span className="subject-type">{subject.type}</span>
                </div>
                <span className={`subject-badge ${complete ? 'delivered' : 'pending'}`}>
                  {complete ? 'ENTREGADO' : 'PENDIENTE'}
                </span>
              </div>
              <div className="subject-card-body">
                <span className="subject-status">
                  {subject.title ? subject.title : 'Sin título aún'}
                </span>
                {subject.fileName && <span className="subject-file"><Paperclip size={12} /> {subject.fileName}</span>}
                {subject.dueDate && <span className="subject-date"><Calendar size={12} /> {formatDateLabel(subject.dueDate)}</span>}
              </div>
              <ChevronRight size={18} className="subject-chevron" />
            </button>
          );
        })}
      </div>

      <div className="tasks-separator">
        <span className="separator-line" />
        <span className="separator-label">TAREAS PERSONALES</span>
        <span className="separator-line" />
      </div>

      <div className="personal-tasks">
        <div className="personal-tasks-header">
          <span>{completedPersonal} / {personalTasks.length} completadas</span>
        </div>
        {personalTasks.map((task) => (
          <div
            className={`personal-task-row ${task.completed ? 'done' : ''}`}
            key={task.id}
          >
            <button className="personal-task-main" onClick={() => togglePersonal(task.id)}>
              <span className={`check-circle ${task.completed ? 'checked' : ''}`}>
                {task.completed && <Check size={14} />}
              </span>
              <span className="personal-task-title">{task.title}</span>
            </button>
            {editingPersonalId === task.id ? (
              <div className="date-edit-inline">
                <input
                  type="date"
                  value={editingPersonalDate}
                  onChange={(e) => setEditingPersonalDate(e.target.value)}
                />
                <button type="button" className="date-save-btn" onClick={saveEditDate}><Check size={14} /></button>
                <button type="button" className="date-cancel-btn" onClick={() => setEditingPersonalId(null)}><X size={14} /></button>
              </div>
            ) : (
              <button className="personal-task-date" onClick={(e) => { e.stopPropagation(); startEditDate(task); }}><Calendar size={12} /> {formatDateLabel(task.dueDate)}</button>
            )}
          </div>
        ))}
      </div>

      {activeSubject && draft && (
        <div className="modal-backdrop" onMouseDown={() => { setActiveSubject(null); setDraft(null); }}>
          <form className="task-modal" onSubmit={saveSubject} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="section-kicker">{draft.area}</span>
                <h2>{draft.type}</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => { setActiveSubject(null); setDraft(null); }} aria-label="Cerrar">
                <X size={19} />
              </button>
            </div>

            <label>TÍTULO
              <input
                autoFocus
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Escribe el título..."
              />
            </label>

            <label>TEXTO
              <textarea
                rows={5}
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
                placeholder="Escribe tu contenido aquí..."
              />
            </label>

            <label>FECHA DE ENTREGA
              <input
                type="date"
                value={draft.dueDate}
                onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
              />
            </label>

            <label>INSERTAR ARCHIVO</label>
            <div className="file-upload-area">
              <input type="file" id={`file-${draft.id}`} onChange={handleFile} className="file-input" />
              <label htmlFor={`file-${draft.id}`} className="file-upload-label">
                <Paperclip size={18} />
                <span>{draft.fileName ? draft.fileName : 'Seleccionar archivo'}</span>
              </label>
              {draft.fileName && (
                <button type="button" className="file-clear" onClick={() => setDraft({ ...draft, fileName: null })} aria-label="Quitar archivo">
                  <X size={15} />
                </button>
              )}
            </div>

            <button className="submit-button" type="submit">Guardar</button>
          </form>
        </div>
      )}

      {isAddPersonalOpen && (
        <div className="modal-backdrop" onMouseDown={() => setIsAddPersonalOpen(false)}>
          <form className="task-modal" onSubmit={addPersonalTask} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="section-kicker">Tareas personales</span>
                <h2>Nueva tarea</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setIsAddPersonalOpen(false)} aria-label="Cerrar">
                <X size={19} />
              </button>
            </div>

            <label>NOMBRE DE LA TAREA
              <input
                autoFocus
                value={newPersonal.title}
                onChange={(e) => setNewPersonal({ ...newPersonal, title: e.target.value })}
                placeholder="Ej. Repasar química..."
              />
            </label>

            <label>FECHA
              <input
                type="date"
                value={newPersonal.dueDate}
                onChange={(e) => setNewPersonal({ ...newPersonal, dueDate: e.target.value })}
              />
            </label>

            <button className="submit-button" type="submit">
              <Plus size={18} /> Añadir tarea
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function formatDateLabel(date: string): string {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`));
}

export default SchoolTasks;
