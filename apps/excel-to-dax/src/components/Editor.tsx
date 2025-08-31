import Editor from '@monaco-editor/react'
import '../styles/components.css'

export default function FormulaEditor(props: {
  value: string
  onChange: (v: string) => void
  id?: string
  ariaLabel?: string
  labelledById?: string
}) {
  return (
    <div
      className="editor-container"
      id={props.id}
      role="region"
      // Use one of these: aria-label OR aria-labelledby
      aria-label={props.ariaLabel}
      aria-labelledby={props.labelledById}
    >
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        value={props.value}
        onChange={(v) => props.onChange(v || '')}
        options={{ fontSize: 14, minimap: { enabled: false } }}
      />
    </div>
  )
}
