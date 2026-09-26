import type { Copy } from '../../i18n'

interface Props {
  copy: Copy
  onSelectPrompt?: (text: string) => void
}

export function PageHelp({ copy, onSelectPrompt }: Props) {
  const languageColumns = [
    {
      langCode: 'KK',
      langTitle: 'Қазақ тілі',
      phrases: [
        '«Қайда баруға болады?»',
        '«Амфитеатр қайда орналасқан?»',
        '«15-шағынаудан жағалауының тарихын көрсет»',
        '«Бағытты телефонға жібер»',
      ],
    },
    {
      langCode: 'RU',
      langTitle: 'Русский язык',
      phrases: [
        '«Как пройти к Скальной тропе?»',
        '«Что интересного находится рядом?»',
        '«Покажи историю набережной TarihSky»',
        '«Отправь маршрут на телефон»',
      ],
    },
    {
      langCode: 'EN',
      langTitle: 'English Language',
      phrases: [
        '“Where can I take a scenic walk?”',
        '“Show the history of the Caspian coast”',
        '“What places are nearby?”',
        '“Send the route to my phone”',
      ],
    },
  ]

  return (
    <main className="kiosk-fullscreen-stage help-screen screen-enter">
      <div className="variants-header">
        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          <i />
          {copy.eyebrow}
          <i />
        </span>
        <h1 className="screen-headline" style={{ fontSize: 'clamp(46px, 4.4vw, 76px)' }}>
          {copy.helpTitle}
        </h1>
        <p style={{ maxWidth: '620px', margin: '18px auto 0', color: 'var(--muted)' }}>
          {copy.helpSubtitle}
        </p>
      </div>

      <div className="help-grid">
        {languageColumns.map((col) => (
          <div key={col.langCode} className="help-col glass-panel">
            <div className="help-col-head">
              <span>{col.langCode}</span>
              <h3>{col.langTitle}</h3>
            </div>
            <div className="help-phrase-list">
              {col.phrases.map((phrase, i) => (
                <div
                  key={i}
                  className="help-phrase-item"
                  onClick={() => onSelectPrompt?.(phrase.replace(/[«»“”]/g, ''))}
                  style={{ cursor: 'pointer' }}
                >
                  {phrase}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
