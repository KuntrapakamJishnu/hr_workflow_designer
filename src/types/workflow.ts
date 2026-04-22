import type { Edge, Node } from '@xyflow/react'

export type KeyValuePair = {
  key: string
  value: string
}

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end'

export type StartNodeData = {
  type: 'start'
  title: string
  metadata: KeyValuePair[]
}

export type TaskNodeData = {
  type: 'task'
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValuePair[]
}

export type ApprovalNodeData = {
  type: 'approval'
  title: string
  approverRole: string
  autoApproveThreshold: number
}

export type AutomatedAction = {
  id: string
  label: string
  params: string[]
}

export type AutomatedNodeData = {
  type: 'automated'
  title: string
  actionId: string
  actionParams: Record<string, string>
}

export type EndNodeData = {
  type: 'end'
  endMessage: string
  summaryFlag: boolean
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdgeData = {
  condition?: string
}

export type WorkflowEdge = Edge<WorkflowEdgeData>

export type ValidationIssue = {
  level: 'error' | 'warning'
  message: string
}

export type WorkflowSimulationStep = {
  index: number
  nodeId: string
  nodeType: NodeType
  message: string
  status: 'ok' | 'warning' | 'error'
}

export type SimulationResponse = {
  valid: boolean
  issues: ValidationIssue[]
  steps: WorkflowSimulationStep[]
}

export type WorkflowPayload = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export type SimulationRequest = WorkflowPayload & {
  context?: Record<string, string | number | boolean>
}

export const NODE_LABELS: Record<NodeType, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automated: 'Automated Step',
  end: 'End',
}

export const createNodeDataByType = (type: NodeType): WorkflowNodeData => {
  if (type === 'start') {
    return {
      type: 'start',
      title: 'Workflow Start',
      metadata: [],
    }
  }

  if (type === 'task') {
    return {
      type: 'task',
      title: 'New Task',
      description: '',
      assignee: '',
      dueDate: '',
      customFields: [],
    }
  }

  if (type === 'approval') {
    return {
      type: 'approval',
      title: 'Approval Step',
      approverRole: 'Manager',
      autoApproveThreshold: 0,
    }
  }

  if (type === 'automated') {
    return {
      type: 'automated',
      title: 'Automated Action',
      actionId: '',
      actionParams: {},
    }
  }

  return {
    type: 'end',
    endMessage: 'Workflow Complete',
    summaryFlag: false,
  }
}
