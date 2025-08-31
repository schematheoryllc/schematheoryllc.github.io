import { useMemo, useState } from 'react'
import FormulaEditor from './components/Editor'
import { convertExcelToDax } from './converter/translator'
import type { ConvertOptions, RangeMapping } from './converter/mapping'
import './styles/components.css'

export default function App() {
  const [excel, setExcel] = useState('=SUMIF(A:A, ">0", B:B)')
  const [mode, setMode] = useState<'measure' | 'column'>('measure')
  const [rangesText, setRangesText] = useState('A:A=Sales[Region]\nB:B=Sales[Amount]')

  const ranges: RangeMapping = useMemo(() => {
    const m: RangeMapping = {}
    rangesText.split('\n').forEach(line => {
      const [k, v] = line.split('=').map(s => (s || '').trim())
      if (k && v) m[k.toUpperCase()] = v
    })
    return m
  }, [rangesText])

  const opts: ConvertOptions = { mode, defaultTable: 'Sales', ranges }
  const { dax, warnings } = useMemo(() => convertExcelToDax(excel, opts), [excel, opts])

   return (
    <div className="app-container">
      <h1>Excel → DAX (MVP)</h1>

      <div className="form-row">
        <label id="excel-formula-label">Excel Formula</label>
        <FormulaEditor
          id="excel-formula-editor"
          value={excel}
          onChange={setExcel}
          labelledById="excel-formula-label"
        />
      </div>

      <div className="form-row">
        <label htmlFor="mode-select">Mode</label>
        <select
          id="mode-select"
          value={mode}
          onChange={e => setMode(e.target.value as any)}
        >
          <option value="measure">Measure</option>
          <option value="column">Calculated Column</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="range-mappings">Range mappings (one per line, e.g., A:A=Sales[Amount])</label>
        <textarea
          id="range-mappings"
          className="fullwidth"
          value={rangesText}
          onChange={e => setRangesText(e.target.value)}
          rows={6}
        />
      </div>

      <div className="form-row">
        <h2 id="dax-output-heading">DAX Output</h2>
        <pre className="output-pane" aria-labelledby="dax-output-heading" aria-live="polite">
          {dax}
        </pre>
      </div>

      {warnings.length > 0 && (
        <div className="form-row" aria-live="polite">
          <h3>Warnings</h3>
          <ul>{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}
    </div>
  )
}
