import React from 'react';
import { History, QrCode, Sparkles, X, Footprints } from 'lucide-react';
import type { Place, RouteResponse, KioskConfig } from '../types';
import { DirectionCompass } from './DirectionCompass';

interface PlaceEditorialDrawerProps {
  place: Place;
  route: RouteResponse | null;
  config: KioskConfig;
  lang: string;
  onClose: () => void;
  onOpenTarihSky: (placeId: number) => void;
  onOpenQr: (placeId: number) => void;
}

export const PlaceEditorialDrawer: React.FC<PlaceEditorialDrawerProps> = ({
  place,
  route,
  config,
  lang,
  onClose,
  onOpenTarihSky,
  onOpenQr,
}) => {
  const categoryLabel =
    place.category === 'culture'
      ? (lang === 'kk' ? 'Мәдениет' : lang === 'en' ? 'Culture' : 'Культура')
      : place.category === 'nature'
      ? (lang === 'kk' ? 'Табиғат' : lang === 'en' ? 'Nature' : 'Природа')
      : place.category === 'park'
      ? (lang === 'kk' ? 'Саябақ' : lang === 'en' ? 'Park & Promenade' : 'Парк и отдых')
      : (lang === 'kk' ? 'Тарих' : lang === 'en' ? 'Heritage' : 'История');

  return (
    <aside className="editorial-place-drawer">
      {/* Drawer Top Navigation */}
      <div className="drawer-header-strip">
        <div className="category-meta-group">
          <span className="cat-pill">{categoryLabel}</span>
          {place.curatedBadge && (
            <span className="curated-pill">
              <Sparkles size={11} />
              {place.curatedBadge}
            </span>
          )}
        </div>

        <button onClick={onClose} className="drawer-close-btn" title="Жабу">
          <X size={16} />
        </button>
      </div>

      {/* Photo-First Hero Banner */}
      <div className="drawer-hero-media">
        <img
          src={place.photos?.[0] || place.thumb_url}
          alt={place.name}
          className="hero-media-img"
        />
        <div className="hero-media-gradient" />

        <div className="hero-media-content">
          {place.rating && (
            <div className="hero-rating-badge">★ {place.rating}</div>
          )}
          <h2 className="hero-place-title">{place.name}</h2>
          <p className="hero-place-address">{place.address}</p>
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="drawer-narrative">
        <p className="narrative-summary-lead">{place.summary}</p>
        {place.description && place.description !== place.summary && (
          <p className="narrative-description-body">{place.description}</p>
        )}
      </div>

      {/* Direction Compass Dial */}
      {route && (
        <DirectionCompass
          bearingDeg={route.bearing_deg}
          kioskHeadingDeg={config.origin.heading_deg}
          directionText={route.direction_text}
          distanceM={route.distance_m}
          durationMin={route.duration_min}
          lang={lang}
        />
      )}

      {/* Action Buttons (TarihSky & QR) */}
      <div className="drawer-action-buttons">
        {place.has_scene && (
          <button
            className="editorial-action-btn tarihsky-accent"
            onClick={() => onOpenTarihSky(place.id)}
          >
            <History size={16} />
            <span>
              {lang === 'kk'
                ? 'TarihSky: өткен шақ'
                : lang === 'en'
                ? 'TarihSky: History'
                : 'TarihSky: Тогда и сейчас'}
            </span>
          </button>
        )}

        <button
          className="editorial-action-btn qr-accent"
          onClick={() => onOpenQr(place.id)}
        >
          <QrCode size={16} />
          <span>
            {lang === 'kk'
              ? 'Смартфонға алу'
              : lang === 'en'
              ? 'Send to phone'
              : 'Отправить на телефон'}
          </span>
        </button>
      </div>

      {/* Route Steps */}
      {route?.steps && route.steps.length > 0 && (
        <div className="drawer-route-steps">
          <div className="steps-header">
            <Footprints size={14} className="accent-blue" />
            <span>
              {lang === 'kk'
                ? 'Жаяу бағыт қадамдары'
                : lang === 'en'
                ? 'Walking Navigation Steps'
                : 'Маршрут от стелы'}
            </span>
          </div>

          <ol className="route-steps-ordered-list">
            {route.steps.map((st, i) => (
              <li key={i} className="step-row">
                <span className="step-counter">{i + 1}</span>
                <span className="step-text">{st.instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </aside>
  );
};
