import { useEffect, useState } from 'react';
import { Check, FileText, Plus, Trash2, X } from 'lucide-react';

type Note = {
  id: string;
  title: string;
  content: string;
  color: 'yellow' | 'blue' | 'green';
  createdAt: number;
};

const starterNotes: Note[] = [
  { id: 'note-1', title: 'Idea para el proyecto', content: 'Crear un ritual breve para empezar cada semana con claridad.', color: 'yellow', createdAt: Date.now() - 7200000 },
  { id: 'note-2', title: 'Recordatorio', content: 'Preguntar al equipo qué les ayudaría a planificar mejor.', color: 'blue', createdAt: Date.now() - 86400000 },
  { id: 'note-3', title: 'Pequeñas victorias', content: 'Celebrar el progreso también es parte del plan.', color: 'green', createdAt: Date.now() - 1728000000 },
];

const colorOptions: { id: Note['color']; label: string; bg: string }[] = [
  { id: 'yellow', label: 'Amarillo', bg: '#fff0b4' },
  { id: 'blue', label: 'Azul', bg: '#cce9f1' },
  { id: 'green', label: 'Verde', bg: '#d4e9d6' },
];

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Hace un momento';
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Ayer';
  if (days < 30) return `Hace ${days} días`;
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(timestamp));
}

function NotesView({ addTrigger = 0 }: { addTrigger?: number }) {
  const [notes, setNotes] = useState<Note[]>(starterNotes);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draft, setDraft] = useState({ title: '', content: '', color: 'yellow' as Note['color'] });

  useEffect(() => {
    if (addTrigger > 0) setIsEditorOpen(true);
  }, [addTrigger]);

  const openEditor = () => {
    setDraft({ title: '', content: '', color: 'yellow' });
    setIsEditorOpen(true);
  };

  const saveNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim() && !draft.content.trim()) return;
    const note: Note = {
      id: `note-${Date.now()}`,
      title: draft.title.trim() || 'Sin título',
      content: draft.content.trim(),
      color: draft.color,
      createdAt: Date.now(),
    };
    setNotes((current) => [note, ...current]);
    setDraft({ title: '', content: '', color: 'yellow' });
    setIsEditorOpen(false);
  };

  const deleteNote = (id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id));
  };

  return (
    <div className="notes-view">
      <div className="note-board">
        {notes.map((note) => (
          <article className={`note ${note.color}`} key={note.id}>
            <div className="note-top-row">
              <FileText size={19} />
              <button className="note-delete" onClick={() => deleteNote(note.id)} aria-label="Eliminar nota">
                <Trash2 size={15} />
              </button>
            </div>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <span>{formatRelativeTime(note.createdAt)}</span>
          </article>
        ))}
        {notes.length === 0 && (
          <div className="notes-empty">
            <FileText size={28} />
            <strong>Aún no tienes notas</strong>
            <span>Crea una nueva nota para empezar.</span>
          </div>
        )}
      </div>

      {isEditorOpen && (
        <div className="modal-backdrop" onMouseDown={() => setIsEditorOpen(false)}>
          <form className="task-modal note-editor" onSubmit={saveNote} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="section-kicker">Bloc de notas</span>
                <h2>Nueva nota</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setIsEditorOpen(false)} aria-label="Cerrar">
                <X size={19} />
              </button>
            </div>

            <label>TÍTULO
              <input
                autoFocus
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Título de tu nota..."
              />
            </label>

            <label>CONTENIDO
              <textarea
                rows={8}
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                placeholder="Escribe aquí lo que quieras recordar..."
                className="note-editor-textarea"
              />
            </label>

            <label>COLOR</label>
            <div className="note-color-picker">
              {colorOptions.map((opt) => (
                <button
                  type="button"
                  className={`note-color-swatch ${draft.color === opt.id ? 'selected' : ''}`}
                  style={{ background: opt.bg }}
                  key={opt.id}
                  onClick={() => setDraft({ ...draft, color: opt.id })}
                  aria-label={opt.label}
                >
                  {draft.color === opt.id && <Check size={16} className="note-color-check" />}
                </button>
              ))}
            </div>

            <button className="submit-button" type="submit">
              <Plus size={18} /> Guardar nota
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default NotesView;
