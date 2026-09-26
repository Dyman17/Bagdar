import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Clock, CheckCircle } from 'lucide-react';
import type { Place } from '../types';

interface QrModalProps {
  url: string;
  place: Place;
  lang: string;
  onClose: () => void;
  timeoutSec?: number;
}

export const QrModal: React.FC<QrModalProps> = ({
  url,
  place,
  lang,
  onClose,
  timeoutSec = 60,
}) => {
  const [timeLeft, setTimeLeft] = useState(timeoutSec);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="modal-scrim-backdrop">
      <div className="qr-window-modal">
        <div className="qr-modal-header">
          <div className="qr-category-badge">
            <Smartphone size={15} />
            <span>
              {lang === 'kk'
                ? 'Мобильді навигация'
                : lang === 'en'
                ? 'Mobile Route Sync'
                : 'Маршрут на телефон'}
            </span>
          </div>

          <div className="qr-countdown-tag">
            <Clock size={13} />
            <span>{timeLeft} с</span>
          </div>

          <button onClick={onClose} className="modal-dismiss-btn" title="Жабу / Закрыть">
            <X size={18} />
          </button>
        </div>

        <div className="qr-modal-body">
          <h2 className="qr-headline">
            {lang === 'kk'
              ? `«${place.name}» бағыты смартфоныңызда`
              : lang === 'en'
              ? `Route to "${place.name}" on your mobile`
              : `Маршрут к «${place.name}» в вашем смартфоне`}
          </h2>

          <p className="qr-instructions">
            {lang === 'kk'
              ? 'Камераңызды QR-кодқа бағыттаңыз. Қосымша орнату қажет емес.'
              : lang === 'en'
              ? 'Point your phone camera to scan the QR code. No app download needed.'
              : 'Наведите камеру телефона на QR-код для открытия маршрута в картах.'}
          </p>

          <div className="qr-code-aesthetic-box">
            <div className="qr-brackets corner-tl" />
            <div className="qr-brackets corner-tr" />
            <div className="qr-brackets corner-bl" />
            <div className="qr-brackets corner-br" />

            <div className="qr-svg-wrapper">
              <QRCodeSVG
                value={url}
                size={220}
                level="H"
                includeMargin={true}
                fgColor="#090D16"
              />
            </div>
          </div>

          <div className="qr-highlights-list">
            <div className="highlight-row">
              <CheckCircle size={15} className="highlight-icon" />
              <span>
                {lang === 'kk'
                  ? 'Google Maps және 2GIS-пен тікелей үйлесімді'
                  : lang === 'en'
                  ? 'Compatible with 2GIS and Apple / Google Maps'
                  : 'Синхронизация с 2GIS и картами Google / Apple'}
              </span>
            </div>
            <div className="highlight-row">
              <CheckCircle size={15} className="highlight-icon" />
              <span>
                {lang === 'kk'
                  ? 'Қадамдық жаяу навигация және қашықтық'
                  : lang === 'en'
                  ? 'Step-by-step turn guidance and walk duration'
                  : 'Пошаговый пеший трек с временем пути'}
              </span>
            </div>
          </div>
        </div>

        <div className="qr-voice-guide">
          <span>
            {lang === 'kk'
              ? 'Дауыспен басқару: «Жабу» немесе «Рахмет» деп айтыңыз'
              : lang === 'en'
              ? 'Voice command: Say "Close" or "Thank you"'
              : 'Голосовое управление: Скажите «Закрой» или «Спасибо»'}
          </span>
        </div>
      </div>
    </div>
  );
};
