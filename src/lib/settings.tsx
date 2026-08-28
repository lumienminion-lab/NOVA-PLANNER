import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

export type Profile = {
  name: string;
  initials: string;
  bio: string;
  avatarColor: string;
};

type SettingsContextValue = {
  language: Language;
  theme: Theme;
  profile: Profile;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setProfile: (profile: Profile) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  es: {
    'nav.inicio': 'Inicio',
    'nav.tareas': 'Tareas',
    'nav.agenda': 'Agenda',
    'nav.notas': 'Notas',
    'nav.lectura': 'Lectura',
    'nav.mensajes': 'Mensajes',
    'nav.ajustes': 'Ajustes',
    'nav.planificar': 'Planificar',
    'hero.espacio': 'Mi espacio',
    'hero.buscar': 'Buscar',
    'hero.hola': 'Hola',
    'inicio.paraTi': 'Para ti',
    'inicio.tuDia': 'Tu día, en orden.',
    'inicio.enfoque': 'Enfoque de hoy',
    'inicio.agenda': 'Agenda',
    'inicio.eventos': 'eventos',
    'inicio.notasRapidas': 'Notas rápidas',
    'inicio.ideas': 'Ideas guardadas',
    'inicio.progreso': 'Tu progreso',
    'inicio.pendientes': 'Tareas pendientes',
    'inicio.verTodas': 'Ver todas',
    'inicio.estaSemana': 'Esta semana',
    'inicio.completadas': 'completadas',
    'inicio.noticias': 'Noticias',
    'tareas.organizacion': 'Organización',
    'tareas.misTareas': 'Mis tareas',
    'tareas.nuevaPlanificacion': 'Nueva planificación',
    'tareas.enCurso': 'En curso',
    'tareas.completadas': 'Completadas',
    'tareas.prioridadAlta': 'Prioridad alta',
    'tareas.sinResultados': 'No hay tareas que coincidan con tu búsqueda.',
    'tareas.vacia': 'Aún no tienes tareas pendientes.',
    'tareas.anadir': 'Añade una tarea para empezar.',
    'tareas.cargando': 'Cargando tu planificación...',
    'agenda.calendario': 'Calendario',
    'agenda.titulo': 'Agenda',
    'notas.ideas': 'Ideas',
    'notas.titulo': 'Notas rápidas',
    'notas.nueva': 'Nueva nota',
    'lectura.titulo': 'Biblioteca',
    'lectura.subtitulo': 'Tu colección de libros',
    'lectura.continuar': 'Continuar leyendo',
    'lectura.progreso': 'progreso',
    'mensajes.titulo': 'Mensajes',
    'mensajes.subtitulo': 'Chatea con tus contactos',
    'mensajes.escribir': 'Escribe un mensaje...',
    'mensajes.enviar': 'Enviar',
    'ajustes.titulo': 'Ajustes',
    'ajustes.subtitulo': 'Personaliza tu experiencia',
    'ajustes.apariencia': 'Apariencia',
    'ajustes.modoOscuro': 'Modo oscuro',
    'ajustes.modoClaro': 'Modo claro',
    'ajustes.idioma': 'Idioma',
    'ajustes.espanol': 'Español',
    'ajustes.ingles': 'Inglés',
    'ajustes.cuenta': 'Cuenta',
    'ajustes.perfil': 'Perfil',
    'ajustes.notificaciones': 'Notificaciones',
    'ajustes.acerca': 'Acerca de',
    'ajustes.editarPerfil': 'Editar perfil',
    'ajustes.nombre': 'Nombre',
    'ajustes.iniciales': 'Iniciales',
    'ajustes.bio': 'Biografía',
    'ajustes.colorAvatar': 'Color del avatar',
    'ajustes.guardar': 'Guardar',
    'ajustes.cancelar': 'Cancelar',
    'ajustes.perfilDesc': 'Personaliza cómo te ven en la app',
    'lectura.anadirLibro': 'Añadir libro',
    'lectura.tituloLibro': 'Título del libro',
    'lectura.autor': 'Autor',
    'lectura.portada': 'URL de portada',
    'lectura.paginas': 'Número de páginas',
    'lectura.empezar': 'Empezar lectura',
    'lectura.regresar': 'Volver a la biblioteca',
    'lectura.paginaActual': 'Página actual',
    'lectura.actualizar': 'Actualizar progreso',
    'lectura.sinopsis': 'Sinopsis',
    'lectura.marcarLeido': 'Marcar como leído',
    'lectura.libroAnadido': 'Libro añadido a tu biblioteca',
    'lectura.progresoGuardado': 'Progreso guardado',
    'chat.asistente': 'Asistente escolar',
    'chat.enLinea': 'En línea',
    'chat.sugerencias': 'Sugerencias para empezar',
    'chat.placeholder': 'Pregúntame sobre exámenes, horarios, tareas...',
    'sinFecha': 'Sin fecha',
  },
  en: {
    'nav.inicio': 'Home',
    'nav.tareas': 'Tasks',
    'nav.agenda': 'Agenda',
    'nav.notas': 'Notes',
    'nav.lectura': 'Reading',
    'nav.mensajes': 'Messages',
    'nav.ajustes': 'Settings',
    'nav.planificar': 'Plan',
    'hero.espacio': 'My space',
    'hero.buscar': 'Search',
    'hero.hola': 'Hi',
    'inicio.paraTi': 'For you',
    'inicio.tuDia': 'Your day, in order.',
    'inicio.enfoque': 'Today\'s focus',
    'inicio.agenda': 'Agenda',
    'inicio.eventos': 'events',
    'inicio.notasRapidas': 'Quick notes',
    'inicio.ideas': 'Saved ideas',
    'inicio.progreso': 'Your progress',
    'inicio.pendientes': 'Pending tasks',
    'inicio.verTodas': 'See all',
    'inicio.estaSemana': 'This week',
    'inicio.completadas': 'completed',
    'inicio.noticias': 'News',
    'tareas.organizacion': 'Organization',
    'tareas.misTareas': 'My tasks',
    'tareas.nuevaPlanificacion': 'New plan',
    'tareas.enCurso': 'In progress',
    'tareas.completadas': 'Completed',
    'tareas.prioridadAlta': 'High priority',
    'tareas.sinResultados': 'No tasks match your search.',
    'tareas.vacia': 'No pending tasks yet.',
    'tareas.anadir': 'Add a task to get started.',
    'tareas.cargando': 'Loading your planning...',
    'agenda.calendario': 'Calendar',
    'agenda.titulo': 'Agenda',
    'notas.ideas': 'Ideas',
    'notas.titulo': 'Quick notes',
    'notas.nueva': 'New note',
    'lectura.titulo': 'Library',
    'lectura.subtitulo': 'Your book collection',
    'lectura.continuar': 'Continue reading',
    'lectura.progreso': 'progress',
    'mensajes.titulo': 'Messages',
    'mensajes.subtitulo': 'Chat with your contacts',
    'mensajes.escribir': 'Type a message...',
    'mensajes.enviar': 'Send',
    'ajustes.titulo': 'Settings',
    'ajustes.subtitulo': 'Customize your experience',
    'ajustes.apariencia': 'Appearance',
    'ajustes.modoOscuro': 'Dark mode',
    'ajustes.modoClaro': 'Light mode',
    'ajustes.idioma': 'Language',
    'ajustes.espanol': 'Spanish',
    'ajustes.ingles': 'English',
    'ajustes.cuenta': 'Account',
    'ajustes.perfil': 'Profile',
    'ajustes.notificaciones': 'Notifications',
    'ajustes.acerca': 'About',
    'ajustes.editarPerfil': 'Edit profile',
    'ajustes.nombre': 'Name',
    'ajustes.iniciales': 'Initials',
    'ajustes.bio': 'Bio',
    'ajustes.colorAvatar': 'Avatar color',
    'ajustes.guardar': 'Save',
    'ajustes.cancelar': 'Cancel',
    'ajustes.perfilDesc': 'Customize how you appear in the app',
    'lectura.anadirLibro': 'Add book',
    'lectura.tituloLibro': 'Book title',
    'lectura.autor': 'Author',
    'lectura.portada': 'Cover URL',
    'lectura.paginas': 'Number of pages',
    'lectura.empezar': 'Start reading',
    'lectura.regresar': 'Back to library',
    'lectura.paginaActual': 'Current page',
    'lectura.actualizar': 'Update progress',
    'lectura.sinopsis': 'Synopsis',
    'lectura.marcarLeido': 'Mark as read',
    'lectura.libroAnadido': 'Book added to your library',
    'lectura.progresoGuardado': 'Progress saved',
    'chat.asistente': 'School assistant',
    'chat.enLinea': 'Online',
    'chat.sugerencias': 'Suggestions to start',
    'chat.placeholder': 'Ask me about exams, schedules, homework...',
    'sinFecha': 'No date',
  },
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const defaultProfile: Profile = {
  name: 'Mia González',
  initials: 'MG',
  bio: 'Estudiante de 5to año de secundaria. Me encanta la literatura y la planificación.',
  avatarColor: '#4b91b7',
};

export const avatarColors = ['#4b91b7', '#e87a5c', '#59aeaa', '#c55b8e', '#e8a640', '#7b6ec4', '#4ba88a', '#d96880'];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('app-language') as Language) || 'es';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('app-theme') as Theme) || 'light';
  });
  const [profile, setProfile] = useState<Profile>(() => {
    const stored = localStorage.getItem('app-profile');
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app-profile', JSON.stringify(profile));
  }, [profile]);

  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light');

  const t = (key: string) => translations[language][key] || key;

  return (
    <SettingsContext.Provider value={{ language, theme, profile, setLanguage, setTheme, setProfile, toggleTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
