
export function histogram(others: number[], mine: number, buckets = 20) {
  const all = [...others, mine]
  const min = Math.min(...all), max = Math.max(...all)
  if (min === max) return null
  const step = (max - min) / buckets
  const out = Array.from({ length: buckets }, (_, i) => ({ value: min + i * step, count: 0 }))
  for (const v of all) out[Math.min(buckets - 1, Math.floor((v - min) / step))]!.count++
  return out
}