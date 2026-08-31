import { useState } from 'react'
import type { ProjectInfo } from '../i18n/types'

export default function FileExplorer({ projects }: { projects: ProjectInfo[] }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = projects[activeIdx]

  return (
    <div className="w-full rounded-none border border-dashed border-[var(--terminalGreen)] font-mono text-xs sm:text-sm">
      <div className="truncate rounded-none border-b border-dashed border-[var(--terminalGreen)] px-3 py-1.5 text-[var(--textMuted)]">
        <span className="text-[var(--terminalGreen)]">$</span> find ./projects -type f -exec cat {'{'} {'}'} \;
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[35fr_65fr]">
        <ul className="rounded-none border-b border-dashed border-[var(--terminalGreen)] md:min-h-[320px] md:border-b-0 md:border-r">
          <li className="select-none px-3 py-1 text-[var(--placeholder)]">
            <span className="select-none">{'drwxr-xr-x'}</span>&nbsp;&nbsp;../..
          </li>
          {projects.map((p, i) => (
            <li key={p.name}>
              <button
                type="button"
                onMouseEnter={() => setActiveIdx(i)}
                onFocus={() => setActiveIdx(i)}
                onClick={() => setActiveIdx(i)}
                className={
                  'flex w-full items-center gap-x-2 rounded-none px-3 py-1 text-left transition-colors ' +
                  (i === activeIdx
                    ? 'bg-[var(--terminalGreen)] font-bold text-[var(--cardBg)]'
                    : 'text-[var(--textMuted)] hover:text-[var(--terminalGreen)]')
                }
              >
                <span className="select-none">{p.perm}</span>
                <span className="flex-1 truncate">{p.name}</span>
                <span className="hidden select-none text-[var(--placeholder)] lg:inline">{p.date}</span>
                {i === activeIdx && <span className="select-none text-[var(--cardBg)]">{'<-- [ACTIVE]'}</span>}
              </button>
            </li>
          ))}
        </ul>

        <article className="rounded-none p-4 md:min-h-[320px] md:p-5">
          <p className="mb-3 select-none truncate text-[var(--placeholder)]">
            ~/projects/<span className="text-[var(--terminalGreen)]">{active.name}</span>
            <span className="text-[var(--textMuted)]"> (README.md)</span>
          </p>

          <h3 className="mb-2 font-mono text-base font-bold text-[var(--textPrimary)] sm:text-lg"># {active.title}</h3>

          <p className="mb-4 leading-relaxed text-[var(--textMuted)]">{active.desc}</p>

          <div className="mb-2 text-[var(--terminalGreen)]">
            STACK:
            <ul className="mt-1">
              {active.stack.map((t) => (
                <li key={t} className="text-[var(--textMuted)]">
                  - {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={active.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-none border border-dashed border-[var(--terminalGreen)] px-3 py-1.5 font-bold text-[var(--terminalGreen)] transition-colors hover:bg-[var(--terminalGreen)] hover:text-[var(--cardBg)]"
            >
              [1: DEMO LIVE]
            </a>
            <a
              href={active.code}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-none border border-dashed border-[var(--terminalGreen)] px-3 py-1.5 font-bold text-[var(--terminalGreen)] transition-colors hover:bg-[var(--terminalGreen)] hover:text-[var(--cardBg)]"
            >
              [2: SOURCE CODE]
            </a>
          </div>
        </article>
      </div>
    </div>
  )
}
