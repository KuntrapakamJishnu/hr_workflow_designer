import { Handle, Position, type NodeProps } from '@xyflow/react'
import { NODE_LABELS, type WorkflowNodeData } from '../../types/workflow'

const typeClass: Record<WorkflowNodeData['type'], string> = {
  start: 'node-chip chip-start',
  task: 'node-chip chip-task',
  approval: 'node-chip chip-approval',
  automated: 'node-chip chip-automated',
  end: 'node-chip chip-end',
}

const nodeTitle = (data: WorkflowNodeData): string => {
  if (data.type === 'start') return data.title
  if (data.type === 'task') return data.title
  if (data.type === 'approval') return data.title
  if (data.type === 'automated') return data.title
  return data.endMessage
}

export const WorkflowNodeCard = ({ data, selected }: NodeProps) => {
  const typedData = data as WorkflowNodeData

  return (
    <div className={`workflow-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <span className={typeClass[typedData.type]}>{NODE_LABELS[typedData.type]}</span>
      <strong className="node-title">{nodeTitle(typedData)}</strong>
      <span className="node-id">{typedData.type} node</span>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
