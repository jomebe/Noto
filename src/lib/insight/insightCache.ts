const cache = new Map<string, string>()

export function getCachedInsight(markId: string): string | undefined {
  return cache.get(markId)
}

export function setCachedInsight(markId: string, text: string): void {
  cache.set(markId, text)
}

export function clearInsightCache(): void {
  cache.clear()
}
