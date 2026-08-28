import { ChevronRight, Clock3 } from 'lucide-react';
import { newsItems } from '@/lib/contentData';
import { useSettings } from '@/lib/settings';

function NewsSection() {
  const { t } = useSettings();
  const featured = newsItems[0];
  const rest = newsItems.slice(1);

  return (
    <div className="news-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">{t('inicio.noticias')}</span>
          <h2 className="news-logo">NOVA<span className="news-logo-accent">-TICIAS</span></h2>
        </div>
        <button className="text-button">Ver todas</button>
      </div>

      <article className="news-featured">
        <div className="news-featured-image">
          <img src={featured.image} alt={featured.title} loading="lazy" />
          <span className="news-badge">{featured.category}</span>
        </div>
        <div className="news-featured-body">
          <h3>{featured.title}</h3>
          <p>{featured.summary}</p>
          <span className="news-time"><Clock3 size={13} /> {featured.time}</span>
        </div>
      </article>

      <div className="news-list">
        {rest.map((item) => (
          <article className="news-row" key={item.id}>
            <div className="news-row-image">
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
            <div className="news-row-body">
              <span className="news-row-category">{item.category}</span>
              <strong>{item.title}</strong>
              <span className="news-time"><Clock3 size={12} /> {item.time}</span>
            </div>
            <ChevronRight size={18} className="news-row-chevron" />
          </article>
        ))}
      </div>
    </div>
  );
}

export default NewsSection;
