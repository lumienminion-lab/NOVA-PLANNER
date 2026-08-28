import { useEffect, useRef, useState } from 'react';
import { ArrowUp, GraduationCap, Sparkles, X } from 'lucide-react';
import {
  ChatMessage,
  createMessage,
  generateAssistantReply,
  initialAssistantMessage,
  suggestedPrompts,
} from '@/lib/studyAssistant';
import { useSettings } from '@/lib/settings';

type StudyChatProps = {
  open: boolean;
  onClose: () => void;
};

function StudyChat({ open, onClose }: StudyChatProps) {
  const { t } = useSettings();
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setMessages([initialAssistantMessage]);
      setInput('');
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage = createMessage('user', trimmed);
    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAssistantReply(trimmed);
      setMessages((current) => [...current, createMessage('assistant', reply)]);
      setIsTyping(false);
    }, 650 + Math.random() * 500);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  if (!open) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-panel">
        <header className="chat-header">
          <div className="chat-identity">
            <span className="chat-avatar"><GraduationCap size={22} /></span>
            <div>
              <strong>{t('chat.asistente')}</strong>
              <span className="chat-status"><i /> {t('chat.enLinea')}</span>
            </div>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Cerrar chat"><X size={20} /></button>
        </header>

        <div className="chat-scroll" ref={scrollRef}>
          {messages.map((message) => (
            <div className={`chat-bubble ${message.role}`} key={message.id}>
              {message.role === 'assistant' && <span className="bubble-avatar"><GraduationCap size={14} /></span>}
              <div className="bubble-content">
                {message.content.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble assistant">
              <span className="bubble-avatar"><GraduationCap size={14} /></span>
              <div className="bubble-content typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          {messages.length <= 1 && (
            <div className="suggestions">
              <span className="suggestions-label"><Sparkles size={14} /> {t('chat.sugerencias')}</span>
              <div className="suggestions-grid">
                {suggestedPrompts.map((suggestion) => (
                  <button
                    type="button"
                    className="suggestion-chip"
                    key={suggestion.label}
                    onClick={() => sendMessage(suggestion.prompt)}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form className="chat-input-area" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder={t('chat.placeholder')}
            rows={1}
          />
          <button type="submit" className="chat-send" disabled={!input.trim() || isTyping} aria-label="Enviar mensaje">
            <ArrowUp size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudyChat;
