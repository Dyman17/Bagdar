import React from 'react';
import { Navigation } from 'lucide-react';

interface DirectionCompassProps {
  bearingDeg: number;
  kioskHeadingDeg: number;
  directionText: string;
  distanceM: number;
  durationMin: number;
  lang: string;
}

export const DirectionCompass: React.FC<DirectionCompassProps> = ({
  bearingDeg,
  kioskHeadingDeg,
  directionText,
  distanceM,
  durationMin,
  lang,
}) => {
  const relativeAngle = (bearingDeg - kioskHeadingDeg + 360) % 360;

  let relativeDescription = '';
  if (relativeAngle >= 340 || relativeAngle <= 20) {
    relativeDescription = lang === 'kk' ? 'Тура алға' : lang === 'en' ? 'Straight ahead' : 'Прямо перед вами';
  } else if (relativeAngle > 20 && relativeAngle < 70) {
    relativeDescription = lang === 'kk' ? 'Алға оңға қарай' : lang === 'en' ? 'Slightly right' : 'Впереди правее';
  } else if (relativeAngle >= 70 && relativeAngle <= 110) {
    relativeDescription = lang === 'kk' ? 'Оң жаққа бұрылыңыз' : lang === 'en' ? 'Turn right' : 'Направо от экрана';
  } else if (relativeAngle > 110 && relativeAngle < 160) {
    relativeDescription = lang === 'kk' ? 'Артқа оңға' : lang === 'en' ? 'Back right' : 'Сзади справа';
  } else if (relativeAngle >= 160 && relativeAngle <= 200) {
    relativeDescription = lang === 'kk' ? 'Артқа қарай' : lang === 'en' ? 'Behind you' : 'Позади стелы';
  } else if (relativeAngle > 200 && relativeAngle < 250) {
    relativeDescription = lang === 'kk' ? 'Артқа солға' : lang === 'en' ? 'Back left' : 'Сзади слева';
  } else if (relativeAngle >= 250 && relativeAngle <= 290) {
    relativeDescription = lang === 'kk' ? 'Сол жаққа бұрылыңыз' : lang === 'en' ? 'Turn left' : 'Налево от экрана';
  } else {
    relativeDescription = lang === 'kk' ? 'Алға солға қарай' : lang === 'en' ? 'Slightly left' : 'Впереди левее';
  }

  return (
    <div className="clean-compass-layout">
      {/* Compass Dial */}
      <div className="clean-compass-dial">
        <div className="clean-compass-ticks">
          <span className="clean-tick n">0°</span>
          <span className="clean-tick e">90°</span>
          <span className="clean-tick s">180°</span>
          <span className="clean-tick w">270°</span>
        </div>

        <div className="clean-compass-center-label">
          <span>{lang === 'kk' ? 'Сіз' : 'Вы'}</span>
        </div>

        <div
          className="clean-compass-needle"
          style={{ transform: `rotate(${relativeAngle}deg)` }}
        >
          <Navigation className="clean-needle-arrow text-zinc-100" />
        </div>
      </div>

      {/* Compass Text Guidance */}
      <div className="clean-compass-info">
        <span className="clean-compass-rel-heading">{relativeDescription}</span>
        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-900">{distanceM} м</span>
          <span>·</span>
          <span className="font-semibold text-zinc-900">~{durationMin} мин</span>
          <span>пешком</span>
        </div>
        <p className="clean-compass-sub-step mt-2">{directionText}</p>
      </div>
    </div>
  );
};
