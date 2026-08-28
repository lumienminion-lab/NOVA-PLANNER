import { useState } from 'react';
import { ArrowLeft, BookOpen, Check, ChevronRight, Minus, Plus, Save } from 'lucide-react';
import { books as initialBooks, type Book } from '@/lib/contentData';
import { useSettings } from '@/lib/settings';

function ReadingView() {
  const { t } = useSettings();
  const [bookList, setBookList] = useState<Book[]>(initialBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', cover: '', totalPages: '' });

  const continueReading = bookList.filter((book) => book.progress > 0 && book.progress < 100);
  const finished = bookList.filter((book) => book.progress === 100);
  const notStarted = bookList.filter((book) => book.progress === 0);

  const openBook = (book: Book) => setSelectedBook(book);

  const updateProgress = (book: Book, newPage: number) => {
    const clampedPage = Math.max(0, Math.min(newPage, book.totalPages));
    const progress = book.totalPages > 0 ? Math.round((clampedPage / book.totalPages) * 100) : 0;
    const updated = { ...book, currentPage: clampedPage, progress };
    setBookList((current) => current.map((b) => b.id === book.id ? updated : b));
    setSelectedBook(updated);
  };

  const markAsRead = (book: Book) => {
    const updated = { ...book, currentPage: book.totalPages, progress: 100 };
    setBookList((current) => current.map((b) => b.id === book.id ? updated : b));
    setSelectedBook(updated);
  };

  const addBook = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) return;
    const totalPages = parseInt(newBook.totalPages, 10) || 100;
    const cover = newBook.cover.trim() || 'https://images.pexels.com/photos/19969897/pexels-photo-19969897.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
    const book: Book = {
      id: `book-${Date.now()}`,
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      cover,
      progress: 0,
      totalPages,
      currentPage: 0,
    };
    setBookList((current) => [book, ...current]);
    setNewBook({ title: '', author: '', cover: '', totalPages: '' });
    setIsAddOpen(false);
  };

  if (selectedBook) {
    return (
      <div className="view-content fade-in">
        <button className="back-button" onClick={() => setSelectedBook(null)}>
          <ArrowLeft size={20} /> {t('lectura.regresar')}
        </button>
        <div className="book-detail">
          <div className="book-detail-cover">
            <img src={selectedBook.cover} alt={selectedBook.title} />
            {selectedBook.progress === 100 && <span className="book-completed-badge"><Check size={14} /></span>}
          </div>
          <div className="book-detail-info">
            <h2>{selectedBook.title}</h2>
            <span className="book-detail-author">{selectedBook.author}</span>
            <div className="book-detail-progress-ring">
              <div className="progress-ring" style={{ '--progress': `${selectedBook.progress}%` } as React.CSSProperties}>
                <span>{selectedBook.progress}%</span>
              </div>
              <div className="book-detail-pages">
                <strong>{selectedBook.currentPage}</strong>
                <small> / {selectedBook.totalPages} {t('lectura.progreso')}</small>
              </div>
            </div>
          </div>
        </div>

        <div className="book-detail-section">
          <span className="section-kicker">{t('lectura.paginaActual')}</span>
          <div className="page-stepper">
            <button className="stepper-btn" onClick={() => updateProgress(selectedBook, selectedBook.currentPage - 1)} disabled={selectedBook.currentPage <= 0} aria-label="Restar página"><Minus size={18} /></button>
            <span className="stepper-value">{selectedBook.currentPage}</span>
            <button className="stepper-btn" onClick={() => updateProgress(selectedBook, selectedBook.currentPage + 1)} disabled={selectedBook.currentPage >= selectedBook.totalPages} aria-label="Sumar página"><Plus size={18} /></button>
          </div>
          <input
            type="range"
            className="page-slider"
            min={0}
            max={selectedBook.totalPages}
            value={selectedBook.currentPage}
            onChange={(e) => updateProgress(selectedBook, parseInt(e.target.value, 10))}
          />
          {selectedBook.progress < 100 && (
            <button className="primary-action full-width" onClick={() => markAsRead(selectedBook)}>
              <Check size={18} /> {t('lectura.marcarLeido')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="view-content fade-in">
      <PageTitle eyebrow={t('lectura.titulo')} title={t('lectura.subtitulo')} action={<button className="primary-action" onClick={() => setIsAddOpen(true)}><Plus size={18} />{t('lectura.anadirLibro')}</button>} />

      {continueReading.length > 0 && (
        <div className="reading-block">
          <span className="section-kicker">{t('lectura.continuar')}</span>
          <div className="book-shelf">
            {continueReading.map((book) => (
              <button className="book-card" key={book.id} onClick={() => openBook(book)}>
                <div className="book-cover">
                  <img src={book.cover} alt={book.title} loading="lazy" />
                  <div className="book-progress-bar">
                    <div className="book-progress-fill" style={{ width: `${book.progress}%` }} />
                  </div>
                </div>
                <div className="book-info">
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                  <div className="book-progress-text">
                    <span className="book-progress-percent">{book.progress}%</span>
                    <span className="book-progress-pages">{book.currentPage} / {book.totalPages}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {notStarted.length > 0 && (
        <div className="reading-block">
          <span className="section-kicker">Por empezar</span>
          <div className="book-shelf">
            {notStarted.map((book) => (
              <button className="book-card" key={book.id} onClick={() => openBook(book)}>
                <div className="book-cover">
                  <img src={book.cover} alt={book.title} loading="lazy" />
                  <div className="book-progress-bar">
                    <div className="book-progress-fill" style={{ width: '0%' }} />
                  </div>
                </div>
                <div className="book-info">
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                  <div className="book-progress-text">
                    <span className="book-progress-percent">0%</span>
                    <span className="book-progress-pages">{book.totalPages} págs</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {finished.length > 0 && (
        <div className="reading-block">
          <span className="section-kicker">Completados</span>
          <div className="book-shelf">
            {finished.map((book) => (
              <button className="book-card finished" key={book.id} onClick={() => openBook(book)}>
                <div className="book-cover">
                  <img src={book.cover} alt={book.title} loading="lazy" />
                  <span className="book-completed-badge"><Check size={14} /></span>
                </div>
                <div className="book-info">
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                  <div className="book-progress-text">
                    <span className="book-progress-percent done">100%</span>
                    <span className="book-progress-pages">{book.totalPages} págs</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isAddOpen && (
        <div className="modal-backdrop" onMouseDown={() => setIsAddOpen(false)}>
          <form className="task-modal" onSubmit={addBook} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="section-kicker">{t('lectura.titulo')}</span>
                <h2>{t('lectura.anadirLibro')}</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setIsAddOpen(false)} aria-label="Cerrar">
                <span className="close-x" />
              </button>
            </div>
            <label>{t('lectura.tituloLibro')}
              <input autoFocus value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} placeholder="Don Quijote de la Mancha" />
            </label>
            <label>{t('lectura.autor')}
              <input value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} placeholder="Miguel de Cervantes" />
            </label>
            <label>{t('lectura.portada')} <small>(opcional)</small>
              <input value={newBook.cover} onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })} placeholder="https://..." />
            </label>
            <label>{t('lectura.paginas')}
              <input type="number" min={1} value={newBook.totalPages} onChange={(e) => setNewBook({ ...newBook, totalPages: e.target.value })} placeholder="300" />
            </label>
            <button className="submit-button" type="submit">
              {t('lectura.anadirLibro')} <ChevronRight size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function PageTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action: React.ReactNode }) {
  return (
    <div className="page-title">
      <div>
        <span className="section-kicker">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export default ReadingView;
