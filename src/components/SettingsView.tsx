import { useState } from 'react';
import { Bell, ChevronRight, Globe, Info, Pencil, Sun, UserRound, X } from 'lucide-react';
import { useSettings, avatarColors, type Language, type Profile, type Theme } from '@/lib/settings';

function SettingsView() {
  const { t, theme, setTheme, language, setLanguage, profile, setProfile } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);

  const startEditing = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned: Profile = {
      ...draft,
      name: draft.name.trim() || profile.name,
      initials: (draft.initials.trim() || profile.initials).slice(0, 2).toUpperCase(),
      bio: draft.bio.trim(),
    };
    setProfile(cleaned);
    setIsEditing(false);
  };

  return (
    <div className="view-content fade-in">
      <PageTitle eyebrow={t('ajustes.titulo')} title={t('ajustes.subtitulo')} />

      <div className="settings-group">
        <span className="settings-group-label">{t('ajustes.perfil')}</span>
        <div className="settings-card profile-card">
          <div className="profile-preview">
            <span className="profile-avatar" style={{ background: profile.avatarColor }}>{profile.initials}</span>
            <div className="profile-preview-info">
              <strong>{profile.name}</strong>
              <span>{profile.bio}</span>
            </div>
            <button className="icon-button" onClick={startEditing} aria-label={t('ajustes.editarPerfil')}><Pencil size={18} /></button>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <span className="settings-group-label">{t('ajustes.apariencia')}</span>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-icon sun"><Sun size={20} /></span>
            <div className="settings-row-info">
              <strong>{theme === 'dark' ? t('ajustes.modoOscuro') : t('ajustes.modoClaro')}</strong>
              <span>{theme === 'dark' ? 'Tema oscuro activado' : 'Tema claro activado'}</span>
            </div>
            <button className={`theme-toggle ${theme}`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark' as Theme)} aria-label="Cambiar tema">
              <span className="theme-toggle-knob" />
            </button>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <span className="settings-group-label">{t('ajustes.idioma')}</span>
        <div className="settings-card">
          <div className="settings-row">
            <span className="settings-icon globe"><Globe size={20} /></span>
            <div className="settings-row-info">
              <strong>{t('ajustes.idioma')}</strong>
              <span>{language === 'es' ? t('ajustes.espanol') : t('ajustes.ingles')}</span>
            </div>
          </div>
          <div className="language-options">
            <button className={`lang-option ${language === 'es' ? 'active' : ''}`} onClick={() => setLanguage('es' as Language)}>
              <span className="lang-flag">ES</span>
              <span>{t('ajustes.espanol')}</span>
              {language === 'es' && <span className="lang-check">✓</span>}
            </button>
            <button className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => setLanguage('en' as Language)}>
              <span className="lang-flag">EN</span>
              <span>{t('ajustes.ingles')}</span>
              {language === 'en' && <span className="lang-check">✓</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="settings-group">
        <span className="settings-group-label">{t('ajustes.cuenta')}</span>
        <div className="settings-card">
          <button className="settings-row"><span className="settings-icon bell"><Bell size={20} /></span><div className="settings-row-info"><strong>{t('ajustes.notificaciones')}</strong><span>Activadas</span></div><ChevronRight size={18} className="settings-chevron" /></button>
          <button className="settings-row"><span className="settings-icon info"><Info size={20} /></span><div className="settings-row-info"><strong>{t('ajustes.acerca')}</strong><span>Versión 1.0.0</span></div><ChevronRight size={18} className="settings-chevron" /></button>
        </div>
      </div>

      {isEditing && (
        <div className="modal-backdrop" onMouseDown={() => setIsEditing(false)}>
          <form className="task-modal" onSubmit={saveProfile} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="section-kicker">{t('ajustes.perfil')}</span>
                <h2>{t('ajustes.editarPerfil')}</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setIsEditing(false)} aria-label={t('ajustes.cancelar')}><X size={19} /></button>
            </div>

            <div className="profile-edit-avatar">
              <span className="profile-avatar large" style={{ background: draft.avatarColor }}>{draft.initials.slice(0, 2).toUpperCase() || '?'}</span>
            </div>

            <label>{t('ajustes.nombre')}
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Mia González" />
            </label>
            <label>{t('ajustes.iniciales')}
              <input maxLength={2} value={draft.initials} onChange={(e) => setDraft({ ...draft, initials: e.target.value.toUpperCase() })} placeholder="MG" />
            </label>
            <label>{t('ajustes.bio')}
              <textarea rows={3} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} placeholder="Estudiante de 5to año..." />
            </label>
            <label>{t('ajustes.colorAvatar')}</label>
            <div className="color-picker">
              {avatarColors.map((color) => (
                <button
                  type="button"
                  className={`color-swatch ${draft.avatarColor === color ? 'selected' : ''}`}
                  style={{ background: color }}
                  key={color}
                  onClick={() => setDraft({ ...draft, avatarColor: color })}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>

            <button className="submit-button" type="submit">{t('ajustes.guardar')}</button>
          </form>
        </div>
      )}
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

export default SettingsView;
