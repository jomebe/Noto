export type MarkKind = 'link' | 'star'

export type PdfTextBox = {
  pageIndex: number
  text: string
  left: number
  top: number
  width: number
  height: number
}

export type OverlayMark = {
  id: string
  pageIndex: number
  left: number
  top: number
  width: number
  height: number
  kind: MarkKind
  matchedText: string
  transcriptSnippet: string
  insight?: string
}
