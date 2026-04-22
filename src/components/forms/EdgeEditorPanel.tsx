import { useMemo, useState } from 'react'
import type { WorkflowEdge } from '../../types/workflow'
import {
  CONDITION_OPERATORS,
  parseEdgeConditionExpression,
  stringifyEdgeCondition,
  type ConditionOperator,
  type ConditionValueType,
} from '../../utils/edgeCondition'

const QUICK_PRESETS = [
  { label: 'High Amount', expression: 'amount >= 1000' },
  { label: 'Approved', expression: 'approved == true' },
  { label: 'Manager Role', expression: 'role == "Manager"' },
  { label: 'HRBP Role', expression: 'role == "HRBP"' },
]

type EdgeEditorPanelProps = {
  edge: WorkflowEdge | null
  onUpdateCondition: (edgeId: string, condition: string) => void
  onDelete: () => void
}

export const EdgeEditorPanel = ({ edge, onUpdateCondition, onDelete }: EdgeEditorPanelProps) => {
  if (!edge) {
    return null
  }

  return (
    <EdgeEditorPanelContent edge={edge} onUpdateCondition={onUpdateCondition} onDelete={onDelete} />
  )
}

type EdgeEditorPanelContentProps = {
  edge: WorkflowEdge
  onUpdateCondition: (edgeId: string, condition: string) => void
  onDelete: () => void
}

const EdgeEditorPanelContent = ({
  edge,
  onUpdateCondition,
  onDelete,
}: EdgeEditorPanelContentProps) => {

  const current = edge.data?.condition?.trim() ?? ''
  const parsed = parseEdgeConditionExpression(current)

  const [keyName, setKeyName] = useState(parsed?.key ?? 'amount')
  const [operator, setOperator] = useState<ConditionOperator>(parsed?.operator ?? '>=')
  const [valueType, setValueType] = useState<ConditionValueType>(parsed?.valueType ?? 'number')
  const [value, setValue] = useState(parsed?.value ?? '1000')
  const [rawExpression, setRawExpression] = useState(current)

  const builderPreview = useMemo(
    () => stringifyEdgeCondition({ key: keyName, operator, value, valueType }),
    [keyName, operator, value, valueType],
  )

  const applyBuilder = () => {
    onUpdateCondition(edge.id, builderPreview)
    setRawExpression(builderPreview)
  }

  const clearCondition = () => {
    onUpdateCondition(edge.id, '')
    setRawExpression('')
  }

  return (
    <aside className="panel editor-panel">
      <div className="panel-row">
        <h2>Branch Configuration</h2>
        <button type="button" className="small-btn danger" onClick={onDelete}>
          Delete Edge
        </button>
      </div>
      <p className="muted">
        Edge: {edge.source} -&gt; {edge.target}
      </p>

      <div className="condition-builder">
        <strong>Visual condition builder</strong>
        <div className="condition-grid">
          <label>
            Field
            <input
              value={keyName}
              onChange={(event) => setKeyName(event.target.value)}
              placeholder="amount"
            />
          </label>

          <label>
            Operator
            <select
              value={operator}
              onChange={(event) => setOperator(event.target.value as ConditionOperator)}
            >
              {CONDITION_OPERATORS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Value type
            <select
              value={valueType}
              onChange={(event) => setValueType(event.target.value as ConditionValueType)}
            >
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="text">Text</option>
            </select>
          </label>

          <label>
            Value
            {valueType === 'boolean' ? (
              <select value={value} onChange={(event) => setValue(event.target.value)}>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            ) : (
              <input
                type={valueType === 'number' ? 'number' : 'text'}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={valueType === 'number' ? '1000' : 'Manager'}
              />
            )}
          </label>
        </div>

        <div className="condition-actions">
          <button type="button" className="small-btn" onClick={applyBuilder}>
            Apply Builder
          </button>
          <button type="button" className="small-btn" onClick={clearCondition}>
            Set as Default Path
          </button>
        </div>

        <p className="condition-preview">Preview: {builderPreview || 'no condition (default path)'}</p>
      </div>

      <label>
        Raw condition expression
        <input
          value={rawExpression}
          onChange={(event) => {
            const next = event.target.value
            setRawExpression(next)
            onUpdateCondition(edge.id, next)
          }}
          placeholder='amount >= 1000 or role == "Manager"'
        />
      </label>
      <div className="preset-row">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="preset-chip"
            onClick={() => {
              setRawExpression(preset.expression)
              onUpdateCondition(edge.id, preset.expression)
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <p className="muted">Supports operators: ==, !=, &gt;, &lt;, &gt;=, &lt;=</p>
    </aside>
  )
}
