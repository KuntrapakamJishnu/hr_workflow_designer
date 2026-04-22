import type { AutomatedAction, WorkflowNode, WorkflowNodeData } from '../../types/workflow'
import { applyAutomatedActionParam, applyAutomatedActionSelection } from '../../utils/nodeFormReducer'
import { KeyValueEditor } from './KeyValueEditor'

type NodeEditorPanelProps = {
  node: WorkflowNode | null
  automations: AutomatedAction[]
  onUpdate: (nodeId: string, nextData: WorkflowNodeData) => void
  onDelete: () => void
}

export const NodeEditorPanel = ({
  node,
  automations,
  onUpdate,
  onDelete,
}: NodeEditorPanelProps) => {
  if (!node) {
    return (
      <aside className="panel editor-panel">
        <h2>Node Configuration</h2>
        <p>Select a node on the canvas to edit its fields.</p>
      </aside>
    )
  }

  const data = node.data

  const updateData = (nextData: WorkflowNodeData) => {
    onUpdate(node.id, nextData)
  }

  return (
    <aside className="panel editor-panel">
      <div className="panel-row">
        <h2>Node Configuration</h2>
        <button type="button" className="small-btn danger" onClick={onDelete}>
          Delete Node
        </button>
      </div>

      <p className="muted">Node ID: {node.id}</p>

      {data.type === 'start' && (
        <>
          <label>
            Start title
            <input
              value={data.title}
              onChange={(event) =>
                updateData({
                  ...data,
                  title: event.target.value,
                })
              }
            />
          </label>
          <KeyValueEditor
            label="Metadata"
            value={data.metadata}
            onChange={(metadata) => updateData({ ...data, metadata })}
          />
        </>
      )}

      {data.type === 'task' && (
        <>
          <label>
            Title (required)
            <input
              value={data.title}
              required
              onChange={(event) => updateData({ ...data, title: event.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              value={data.description}
              onChange={(event) =>
                updateData({
                  ...data,
                  description: event.target.value,
                })
              }
            />
          </label>
          <label>
            Assignee
            <input
              value={data.assignee}
              onChange={(event) =>
                updateData({
                  ...data,
                  assignee: event.target.value,
                })
              }
            />
          </label>
          <label>
            Due date
            <input
              type="date"
              value={data.dueDate}
              onChange={(event) => updateData({ ...data, dueDate: event.target.value })}
            />
          </label>
          <KeyValueEditor
            label="Custom fields"
            value={data.customFields}
            onChange={(customFields) => updateData({ ...data, customFields })}
          />
        </>
      )}

      {data.type === 'approval' && (
        <>
          <label>
            Title
            <input
              value={data.title}
              onChange={(event) => updateData({ ...data, title: event.target.value })}
            />
          </label>
          <label>
            Approver role
            <select
              value={data.approverRole}
              onChange={(event) =>
                updateData({
                  ...data,
                  approverRole: event.target.value,
                })
              }
            >
              <option value="Manager">Manager</option>
              <option value="HRBP">HRBP</option>
              <option value="Director">Director</option>
            </select>
          </label>
          <label>
            Auto-approve threshold
            <input
              type="number"
              value={data.autoApproveThreshold}
              onChange={(event) =>
                updateData({
                  ...data,
                  autoApproveThreshold: Number(event.target.value || 0),
                })
              }
            />
          </label>
        </>
      )}

      {data.type === 'automated' && (
        <>
          <label>
            Title
            <input
              value={data.title}
              onChange={(event) => updateData({ ...data, title: event.target.value })}
            />
          </label>

          <label>
            Action
            <select
              value={data.actionId}
              onChange={(event) => {
                const nextActionId = event.target.value
                const action = automations.find((item) => item.id === nextActionId)

                updateData(applyAutomatedActionSelection(data, action))
              }}
            >
              <option value="">Select action</option>
              {automations.map((action) => (
                <option key={action.id} value={action.id}>
                  {action.label}
                </option>
              ))}
            </select>
          </label>

          {(() => {
            const selectedAction = automations.find((item) => item.id === data.actionId)
            if (!selectedAction) {
              return <p className="muted">Choose an action to configure parameters.</p>
            }

            return (
              <div className="dynamic-fields">
                <strong>Action parameters</strong>
                {selectedAction.params.map((paramName) => (
                  <label key={paramName}>
                    {paramName}
                    <input
                      value={data.actionParams[paramName] ?? ''}
                      onChange={(event) =>
                        updateData(applyAutomatedActionParam(data, paramName, event.target.value))
                      }
                    />
                  </label>
                ))}
              </div>
            )
          })()}
        </>
      )}

      {data.type === 'end' && (
        <>
          <label>
            End message
            <input
              value={data.endMessage}
              onChange={(event) =>
                updateData({
                  ...data,
                  endMessage: event.target.value,
                })
              }
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={data.summaryFlag}
              onChange={(event) =>
                updateData({
                  ...data,
                  summaryFlag: event.target.checked,
                })
              }
            />
            Summary flag
          </label>
        </>
      )}
    </aside>
  )
}
