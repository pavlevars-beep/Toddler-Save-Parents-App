/**
 * The parent area.
 *
 * Reached only by holding the leaf for two seconds. Everything a grown-up might
 * want to change during a car ride is here and nothing else — the longer this
 * screen gets, the less anyone reads it.
 */

import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import { chime } from '../../audio/engine'
import { useSettings } from '../../state/settings'
import { APP_VERSION } from '../../version'
import type { Lang } from '../../i18n/strings'

const BREAK_OPTIONS = [0, 10, 20, 30]

export default function ParentSheet({ onClose }: { onClose: () => void }) {
  const { settings, update, t } = useSettings()
  const { canInstall, install } = useInstallPrompt()

  return (
    <div className="sheet" onClick={onClose}>
      <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
        <h2 className="sheet-title">{t.parents.title}</h2>

        <div className="setting">
          <div className="setting-label">
            <span>{t.parents.volume}</span>
            <span>{Math.round(settings.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => update({ volume: Number(e.target.value) })}
            onPointerUp={() => chime(2)}
          />
        </div>

        <div className="setting">
          <div className="setting-label">
            <span>{t.parents.speech}</span>
          </div>
          <div className="seg">
            <button data-on={settings.speech} onClick={() => update({ speech: true })}>
              {t.parents.speechOn}
            </button>
            <button data-on={!settings.speech} onClick={() => update({ speech: false })}>
              {t.parents.speechOff}
            </button>
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">
            <span>{t.parents.calmMode}</span>
          </div>
          <div className="seg">
            <button data-on={settings.calmMode} onClick={() => update({ calmMode: true })}>
              {t.parents.speechOn}
            </button>
            <button data-on={!settings.calmMode} onClick={() => update({ calmMode: false })}>
              {t.parents.speechOff}
            </button>
          </div>
          <p className="setting-help">{t.parents.calmModeHelp}</p>
        </div>

        <div className="setting">
          <div className="setting-label">
            <span>{t.parents.playTime}</span>
          </div>
          <div className="seg">
            {BREAK_OPTIONS.map((min) => (
              <button key={min} data-on={settings.breakMinutes === min} onClick={() => update({ breakMinutes: min })}>
                {min === 0 ? t.parents.playTimeOff : `${min} ${t.parents.minutes}`}
              </button>
            ))}
          </div>
        </div>

        <div className="setting">
          <div className="setting-label">
            <span>{t.parents.language}</span>
          </div>
          <div className="seg">
            {(['sr', 'en'] as Lang[]).map((lang) => (
              <button key={lang} data-on={settings.lang === lang} onClick={() => update({ lang })}>
                {lang === 'sr' ? 'Srpski' : 'English'}
              </button>
            ))}
          </div>
        </div>

        {canInstall && (
          <div className="setting">
            <div className="setting-label">
              <span>{t.parents.install}</span>
            </div>
            <div className="seg">
              <button data-on onClick={() => void install()}>
                {t.parents.install}
              </button>
            </div>
            <p className="setting-help">{t.parents.installHelp}</p>
          </div>
        )}

        <div className="setting">
          <div className="setting-label">
            <span>{t.parents.about}</span>
          </div>
          <p className="sheet-text">{t.parents.aboutText}</p>
        </div>

        <div className="setting">
          <div className="setting-label">
            <span>{t.parents.privacy}</span>
          </div>
          <p className="sheet-text">{t.parents.privacyText}</p>
        </div>

        <button className="sheet-close" onClick={onClose}>
          {t.parents.exit}
        </button>
        <div className="version">
          {t.parents.version} {APP_VERSION}
        </div>
      </div>
    </div>
  )
}
