import type { KeyValuePair } from '../../types/workflow'

type KeyValueEditorProps = {
  label: string
  value: KeyValuePair[]
  onChange: (next: KeyValuePair[]) => void
}

export const KeyValueEditor = ({ label, value, onChange }: KeyValueEditorProps) => {
  const updatePair = (index: number, field: 'key' | 'value', nextValue: string) => {
    const next = value.map((entry, i) =>
      i === index ? { ...entry, [field]: nextValue } : entry,
    )
    onChange(next)
  }

  const addPair = () => {
    onChange([...value, { key: '', value: '' }])
  }

  const removePair = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="kv-editor">
      <div className="panel-row">
        <strong>{label}</strong>
        <button type="button" className="small-btn" onClick={addPair}>
          + Add
        </button>
      </div>
      <div className="kv-list">
        {value.length === 0 && <p className="muted">No entries yet.</p>}
        {value.map((entry, index) => (
          <div key={`${entry.key}-${index}`} className="kv-item">
            <input
              value={entry.key}
              onChange={(event) => updatePair(index, 'key', event.target.value)}
              placeholder="key"
            />
            <input
              value={entry.value}
              onChange={(event) => updatePair(index, 'value', event.target.value)}
              placeholder="value"
            />
            <button type="button" className="small-btn danger" onClick={() => removePair(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
