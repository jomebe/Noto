export function normalizeToken(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
}

export function tokenizeTranscript(chunk: string): string[] {
  const parts = chunk.split(/[\s.,!?;:·…，。、]+/).filter(Boolean)
  const out: string[] = []
  for (const p of parts) {
    const t = p.trim()
    if (t.length >= 1) out.push(t)
  }
  return out
}
