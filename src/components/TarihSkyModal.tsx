import React, { useState } from 'react';
import { X, History, Sparkles } from 'lucide-react';
import type { SceneResponse } from '../types';

interface TarihSkyModalProps {
  scene: SceneResponse;
  lang: string;
  onClose: () => void;
}

export const TarihSkyModal: React.FC<TarihSkyModalProps> = ({
  scene,
  lang,
  onClose,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const texts = scene.texts[lang] || scene.texts.ru || scene.texts.kk || scene.texts.en;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="modal-scrim-backdrop">
      <div className="tarihsky-window-modal">
        {/* Header */}
        <div className="tarihsky-modal-header">
          <div className="tarihsky-title-group">
            <span className="tarihsky-brand-tag">
              <History size={15} />
              TarihSky
            </span>
            <span className="tarihsky-sub-tag">Тогда &amp; Сейчас · Тарихи реконструкция</span>
          </div>

          <button onClick={onClose} className="modal-dismiss-btn" title="Жабу / Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* Comparison Split Canvas */}
        <div className="tarihsky-comparison-stage">
          <div className="split-view-container">
            {/* Modern Layer (Base) */}
            <img
              src={scene.modern_url}
              alt="Бүгінгі көрініс / Современный вид"
              className="split-layer-img modern-photo"
            />
            <div className="split-layer-badge modern-badge">
              {lang === 'kk' ? 'БҮГІН' : lang === 'en' ? 'TODAY' : 'СЕЙЧАС'}
            </div>

            {/* Historic Layer (Clipped) */}
            <div
              className="historic-clipped-layer"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={scene.historic_url}
                alt="Тарихи хроника / Архивный вид"
                className="split-layer-img historic-photo"
              />
              <div className="split-layer-badge historic-badge">
                {lang === 'kk' ? 'ӨТКЕН ШАҚ' : lang === 'en' ? 'PAST' : 'ТОГДА'}
              </div>
            </div>

            {/* Split Drag Line */}
            <div
              className="split-hairline-handle"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="handle-circle-nub">
                <span className="nub-arrows">&#x2039;&#x203A;</span>
              </div>
            </div>

            {/* Drag Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="split-drag-input"
            />
          </div>
        </div>

        {/* Narrative & Attribution */}
        <div className="tarihsky-narrative-panel">
          <div className="narrative-headline-row">
            <h2 className="narrative-title">{texts?.title || 'Тарихи фотошежіре'}</h2>
            <div className="narrative-attribution-badge">
              <Sparkles size={13} />
              <span>{scene.attribution}</span>
            </div>
          </div>

          <p className="narrative-text">{texts?.body}</p>

          {scene.sources?.length > 0 && (
            <div className="narrative-sources-row">
              <span className="sources-caption">
                {lang === 'kk' ? 'Дереккөздер:' : lang === 'en' ? 'Historical Sources:' : 'Источники архива:'}
              </span>
              <span className="sources-content">{scene.sources.join(' · ')}</span>
            </div>
          )}
        </div>

        {/* Voice Hint Footer */}
        <div className="tarihsky-voice-guide">
          <span>
            {lang === 'kk'
              ? 'Дауыспен басқару: «Картаны көрсет» немесе «Жабу» деп айтыңыз'
              : lang === 'en'
              ? 'Voice command: Say "Show map" or "Close"'
              : 'Голосовое управление: Скажите «Покажи карту» или «Закрой»'}
          </span>
        </div>
      </div>
    </div>
  );
};
