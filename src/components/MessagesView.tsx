import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUp, Search, Send } from 'lucide-react';
import { contacts, type Contact } from '@/lib/contentData';
import { useSettings } from '@/lib/settings';

type ChatMessage = {
  id: string;
  role: 'me' | 'them';
  text: string;
  time: string;
};

const initialChats: Record<string, ChatMessage[]> = {
  'contact-1': [
    { id: 'm1', role: 'them', text: '¡Hola! ¿Ya terminaste la tarea de matemáticas?', time: '10:30' },
    { id: 'm2', role: 'me', text: 'Casi, me falta el último ejercicio', time: '10:31' },
  ],
  'contact-2': [
    { id: 'm1', role: 'them', text: 'Nos reunimos en la biblioteca a las 3', time: '09:15' },
  ],
  'contact-3': [
    { id: 'm1', role: 'them', text: 'Te envié el resumen de historia', time: 'Ayer' },
    { id: 'm2', role: 'me', text: '¡Gracias! Lo reviso en la noche', time: 'Ayer' },
  ],
  'contact-4': [
    { id: 'm1', role: 'them', text: '¿Vamos a la presentación del viernes?', time: 'Ayer' },
  ],
  'contact-5': [
    { id: 'm1', role: 'me', text: '¿Te ayudo con el proyecto?', time: 'Lun' },
    { id: 'm2', role: 'them', text: 'Gracias por ayudarme con el proyecto', time: 'Lun' },
  ],
};

function MessagesView() {
  const { t } = useSettings();
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(initialChats);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentMessages = activeContact ? chats[activeContact.id] || [] : [];
  const filteredContacts = contacts.filter((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [currentMessages.length]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !activeContact) return;
    const now = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date());
    const newMessage: ChatMessage = { id: `${Date.now()}`, role: 'me', text: trimmed, time: now };
    setChats((current) => ({ ...current, [activeContact.id]: [...(current[activeContact.id] || []), newMessage] }));
    setInput('');

    setTimeout(() => {
      const replies = ['¡Entendido!', 'Claro, perfecto.', 'Vale, nos vemos entonces.', '¡Jaja, de acuerdo!', 'Bueno, luego hablamos.'];
      const reply: ChatMessage = {
        id: `${Date.now()}-r`,
        role: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: now,
      };
      setChats((current) => ({ ...current, [activeContact.id]: [...(current[activeContact.id] || []), reply] }));
    }, 1200);
  };

  if (activeContact) {
    return (
      <div className="view-content fade-in messages-chat">
        <div className="chat-header-mobile">
          <button className="icon-button" onClick={() => setActiveContact(null)} aria-label="Volver"><ArrowLeft size={20} /></button>
          <span className="msg-avatar">{activeContact.avatar}</span>
          <div className="msg-contact-info">
            <strong>{activeContact.name}</strong>
            <span className="chat-status"><i /> {t('chat.enLinea')}</span>
          </div>
        </div>
        <div className="msg-scroll" ref={scrollRef}>
          {currentMessages.map((msg) => (
            <div className={`msg-bubble ${msg.role}`} key={msg.id}>
              <div className="msg-bubble-content">
                <p>{msg.text}</p>
                <span>{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
        <form className="msg-input-area" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('mensajes.escribir')}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
          />
          <button type="submit" className="msg-send" disabled={!input.trim()} aria-label={t('mensajes.enviar')}><Send size={19} /></button>
        </form>
      </div>
    );
  }

  return (
    <div className="view-content fade-in">
      <PageTitle eyebrow={t('mensajes.titulo')} title={t('mensajes.subtitulo')} />
      <label className="search-box msg-search">
        <Search size={19} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('hero.buscar')} />
        {search && <button type="button" onClick={() => setSearch('')} aria-label="Limpiar"><span className="sr-only">Limpiar</span></button>}
      </label>
      <div className="contact-list">
        {filteredContacts.map((contact) => (
          <button className="contact-row" key={contact.id} onClick={() => setActiveContact(contact)}>
            <span className="msg-avatar">{contact.avatar}</span>
            <div className="contact-info">
              <strong>{contact.name}</strong>
              <span>{contact.lastMessage}</span>
            </div>
            <div className="contact-meta">
              <span className="contact-time">{contact.time}</span>
              {contact.unread > 0 && <span className="contact-unread">{contact.unread}</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PageTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="page-title">
      <div>
        <span className="section-kicker">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

export default MessagesView;
