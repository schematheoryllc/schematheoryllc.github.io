import { type ConvertOptions, mapRange } from './mapping'

const trim = (s: string) => s.trim()

// very small helpers — normalize Excel quirks
function normalizeExcel(expr: string): string {
  // unify decimal/comma locales, remove leading '='
  let s = expr.trim()
  if (s.startsWith('=')) s = s.slice(1)
  // normalize TRUE/FALSE casing, function names casing
  s = s.replace(/\btrue\b/gi, 'TRUE').replace(/\bfalse\b/gi, 'FALSE')
  return s
}

export function convertExcelToDax(expr: string, opts: ConvertOptions): { dax: string, warnings: string[] } {
  const warnings: string[] = []
  let s = normalizeExcel(expr)

  // Replace structured ranges like A:A if mapping provided
  s = s.replace(/\b([A-Za-z]):\1\b/g, (_m, letter) => mapRange(`${letter}:${letter}`, opts.ranges))

  // 1) IF -> IF (same signature)
  s = s.replace(/\bIF\s*\(/gi, 'IF(')

  // 2) Basic arithmetic/logical ops mostly carry over; comparisons need care
  // Excel '=' is both assignment and equality; inside formulas it is equality -> '=' is fine in DAX

  // 3) SUM(range) -> SUM(Table[Col])
  // (naive) keep as-is; user mappings should have expanded A:A earlier
  s = s.replace(/\bSUMIFS?\s*\(/gi, (m) => m.toUpperCase())
  s = s.replace(/\bCOUNTIFS?\s*\(/gi, (m) => m.toUpperCase())

  // 4) COUNTIF(range, cond) -> CALCULATE(COUNTROWS(Table), Table[Col] <cond>)
  // naive expansion only if "X:X" -> "Table[Col]" already occurred
  const countif = s.match(/^COUNTIF\s*\(([^,]+),\s*(.+)\)$/i)
  if (countif) {
    const range = trim(countif[1])
    const cond = trim(countif[2].replace(/\)$/, ''))
    if (!/\[.+\]/.test(range)) warnings.push('COUNTIF: map the range to Table[Column] first.')
    const table = range.split('[')[0]
    s = `CALCULATE(COUNTROWS(${table}), ${range} ${cond})`
  }

  // 5) SUMIF(range, cond, sum_range)
  const sumif = s.match(/^SUMIF\s*\(([^,]+),\s*([^,]+),\s*(.+)\)$/i)
  if (sumif) {
    const range = trim(sumif[1])
    const cond  = trim(sumif[2])
    const sumr  = trim(sumif[3].replace(/\)$/, ''))
    if (!/\[.+\]/.test(range) || !/\[.+\]/.test(sumr)) {
      warnings.push('SUMIF: map both range and sum_range to Table[Column].')
    }
    s = `CALCULATE(SUM(${sumr}), ${range} = ${cond})`
  }

  // 6) VLOOKUP(key, table, colIndex, [approx]) -> LOOKUPVALUE(targetCol, keyCol, key)
  // MVP assumes columns are specified elsewhere; we only scaffold here.
  if (/^VLOOKUP\s*\(/i.test(s)) {
    warnings.push('VLOOKUP: Approximates to LOOKUPVALUE; ensure relationships or key mappings are configured.')
    s = s.replace(/^VLOOKUP\s*\((.+)\)$/i, (_m, inner) => {
      const parts = inner.split(',').map(trim)
      if (parts.length < 3) return '/* Unsupported VLOOKUP() */'
      const key = parts[0]
      // NOTE: We intentionally do not use parts[1] (table) or parts[2] (colIndex) in MVP.
      // Provide a clearly-marked TODO so the user can adjust target/key columns.
      return `/* TODO: set correct columns */ LOOKUPVALUE(DimProduct[TargetCol], DimProduct[KeyCol], ${key})`
    })
  }


  // Mode-specific adjustments (very light for MVP)
  if (opts.mode === 'measure') {
    // Nothing strict here yet; later we’ll enforce aggregation/row-context rules
  }

  return { dax: s, warnings }
}
