export const LANGUAGES = {
  cpp:        { id: 54, label: "C++17",      monaco: "cpp",        timeMultiplier: 1 },
  python:     { id: 71, label: "Python 3",   monaco: "python",     timeMultiplier: 3 },
  java:       { id: 62, label: "Java",       monaco: "java",       timeMultiplier: 2 },
  javascript: { id: 63, label: "JavaScript", monaco: "javascript", timeMultiplier: 2 },
} as const

export type LanguageKey = keyof typeof LANGUAGES

export const isLanguage = (x: unknown): x is LanguageKey =>
  typeof x === "string" && Object.keys(LANGUAGES).includes(x)