import React from 'react';
import type { Place } from '../types';

interface AtlasStripProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  lang: string;
}

export const AtlasStrip: React.FC<AtlasStripProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  activeCategory,
  onSelectCategory,
  lang,
}) => {
  const categories = [
    { id: 'all', label: lang === 'kk' ? 'Барлық орындар' : lang === 'en' ? 'All Places' : 'Все места' },
    { id: 'culture', label: lang === 'kk' ? 'Мәдениет' : lang === 'en' ? 'Culture' : 'Культура' },
    { id: 'nature', label: lang === 'kk' ? 'Табиғат' : lang === 'en' ? 'Nature' : 'Природа' },
    { id: 'park', label: lang === 'kk' ? 'Саябақтар' : lang === 'en' ? 'Parks' : 'Парки' },
  ];

  const filteredPlaces =
    activeCategory === 'all'
      ? places
      : places.filter((p) => p.category === activeCategory);

  return (
    <div className="atlas-strip-container">
      {/* Category Pills Header */}
      <div className="atlas-categories-bar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`atlas-cat-tab ${activeCategory === cat.id ? 'is-active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Horizontal Photo Cards */}
      <div className="atlas-cards-carousel">
        {filteredPlaces.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <div
              key={place.id}
              className={`atlas-place-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelectPlace(place)}
            >
              <div className="card-thumb-wrap">
                <img
                  src={place.photos?.[0] || place.thumb_url}
                  alt={place.name}
                  className="card-thumb-img"
                  loading="lazy"
                />
                <div className="card-thumb-gradient" />
                <span className="card-pin-index">#{place.id}</span>
                {place.curatedBadge && (
                  <span className="card-curated-tag">{place.heroTag || 'Top'}</span>
                )}
              </div>

              <div className="card-info">
                <h4 className="card-name">{place.name}</h4>
                <p className="card-summary">{place.summary}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
