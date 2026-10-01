'use client'

import { useState } from 'react'
import { Code2, Layers, ListChecks, Gauge, ListOrdered, LucideIcon } from 'lucide-react'
import TopicsCard from './TopicsCard'
import { ACCENT, Accent } from '../../lib/configs/thems'

type Props = {
  heading?: string
  step?: number
  accent?: Accent
  setConfig?: React.Dispatch<React.SetStateAction<any>>
}

const KEY_MAP: Record<string, string> = {
  Language: 'language',
  Topic: 'topic',
  'Question Type': 'questionType',
  'Difficulty Level': 'difficulty',
  'Question Length': 'questionLength',
}

const ICONS: Record<string, LucideIcon> = {
  Language: Code2,
  Topic: Layers,
  'Question Type': ListChecks,
  'Difficulty Level': Gauge,
  'Question Length': ListOrdered,
}

const optionsMap: Record<string, { label: string; value: string }[]> = {
  Language: [
    { label: 'C', value: 'c' },
    { label: 'Python', value: 'python' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
    { label: 'JavaScript', value: 'javascript' },
  ],
  Topic: [
    { label: 'Basics', value: 'Basics' },
    { label: 'Array', value: 'Array' },
    { label: 'String', value: 'String' },
    { label: 'Linked List', value: 'Linked List' },
    { label: 'Tree', value: 'Tree' },
    { label: 'Graph', value: 'Graph' },
  ],
  'Question Type': [
    { label: 'Single Correct', value: 'single correct' },
    { label: 'Multiple Correct', value: 'multiple correct' },
    { label: 'Bugfixer', value: 'bugfixer' },
  ],
  'Difficulty Level': [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ],
  'Question Length': [
    { label: '5 Questions', value: '5' },
    { label: '10 Questions', value: '10' },
    { label: '15 Questions', value: '15' },
  ],
}

export default function ConfigurationCard({ heading, step, accent = 'sky', setConfig }: Props) {
  const [selected, setSelected] = useState<string>('')
  const t = ACCENT[accent]

  function handleField(value: string) {
    // Toggle: dobara click par deselect
    const nextValue = selected === value ? '' : value
    setSelected(nextValue)

    if (setConfig) {
      setConfig((prev: any) => {
        const targetKey = heading ? KEY_MAP[heading] : null
        if (!targetKey) return prev
        return { ...prev, [targetKey]: nextValue === '' ? null : nextValue }
      })
    }
  }

  if (!heading) return null

  const currentOptions = optionsMap[heading]
  const Icon = ICONS[heading] ?? Layers
  const selectedLabel = currentOptions?.find((o) => o.value === selected)?.label

  return (
    <div
      className={`group/card relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#121212]/80 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:p-6 ${t.card}`}
    >
      {/* top gradient line */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${t.line} to-transparent ${
          selected ? 'opacity-90' : 'opacity-30'
        } transition-opacity duration-300`}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br ${t.box}`}>
              <Icon className={`h-[18px] w-[18px] ${t.icon}`} />
            </div>
            <div>
              {step !== undefined && (
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Step {String(step).padStart(2, '0')}
                </p>
              )}
              <h2 className="text-sm font-bold tracking-tight text-white sm:text-base">{heading}</h2>
            </div>
          </div>

          {selectedLabel ? (
            <span className={`max-w-[45%] truncate rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${t.pill}`}>
              {selectedLabel}
            </span>
          ) : (
            <span className="font-mono text-[11px] italic text-zinc-600">None selected</span>
          )}
        </div>

        {currentOptions && (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {currentOptions.map((item) => (
              <TopicsCard
                key={item.value}
                field={item.label}
                value={item.value}
                selected={selected}
                accent={accent}
                onClick={() => handleField(item.value)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}