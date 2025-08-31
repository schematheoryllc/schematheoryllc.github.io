export type Mode = 'measure' | 'column'

export type RangeMapping = {
  // e.g., "A:A" -> "Sales[Amount]"
  [excelRange: string]: string
}

export interface ConvertOptions {
  mode: Mode
  defaultTable?: string
  ranges?: RangeMapping
}

export const mapRange = (r: string, m?: RangeMapping) =>
  (m && m[r.toUpperCase()]) || r
