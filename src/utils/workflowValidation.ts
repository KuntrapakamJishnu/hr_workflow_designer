import type { WorkflowEdge, WorkflowNode, ValidationIssue } from '../types/workflow'

const getOutgoingMap = (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
  const map = new Map<string, string[]>()

  nodes.forEach((node) => {
    map.set(node.id, [])
  })

  edges.forEach((edge) => {
    const outgoing = map.get(edge.source)
    if (outgoing) {
      outgoing.push(edge.target)
    }
  })

  return map
}

const detectCycle = (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
  const outgoing = getOutgoingMap(nodes, edges)
  const visited = new Set<string>()
  const inStack = new Set<string>()

  const dfs = (nodeId: string): boolean => {
    if (inStack.has(nodeId)) {
      return true
    }

    if (visited.has(nodeId)) {
      return false
    }

    visited.add(nodeId)
    inStack.add(nodeId)

    const children = outgoing.get(nodeId) ?? []
    for (const childId of children) {
      if (dfs(childId)) {
        return true
      }
    }

    inStack.delete(nodeId)
    return false
  }

  return nodes.some((node) => dfs(node.id))
}

export const validateWorkflow = (nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = []
  const nodeIds = new Set(nodes.map((node) => node.id))

  if (nodes.length === 0) {
    return [{ level: 'error', message: 'Workflow has no nodes.' }]
  }

  const startNodes = nodes.filter((node) => node.data.type === 'start')
  const endNodes = nodes.filter((node) => node.data.type === 'end')

  if (startNodes.length !== 1) {
    issues.push({
      level: 'error',
      message: `Workflow must include exactly one Start node. Found ${startNodes.length}.`,
    })
  }

  if (endNodes.length === 0) {
    issues.push({
      level: 'error',
      message: 'Workflow must include at least one End node.',
    })
  }

  const startIncoming = edges.filter((edge) => {
    const targetNode = nodes.find((node) => node.id === edge.target)
    return targetNode?.data.type === 'start'
  })

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
      issues.push({
        level: 'error',
        message: `Edge "${edge.id}" references an unknown node.`,
      })
    }
  })

  if (startIncoming.length > 0) {
    issues.push({
      level: 'error',
      message: 'Start node cannot have incoming connections.',
    })
  }

  nodes.forEach((node) => {
    const incoming = edges.filter((edge) => edge.target === node.id)
    const outgoing = edges.filter((edge) => edge.source === node.id)

    if (node.data.type !== 'start' && incoming.length === 0) {
      issues.push({
        level: 'warning',
        message: `Node "${node.id}" (${node.data.type}) has no incoming connection.`,
      })
    }

    if (node.data.type !== 'end' && outgoing.length === 0) {
      issues.push({
        level: 'warning',
        message: `Node "${node.id}" (${node.data.type}) has no outgoing connection.`,
      })
    }

    if (outgoing.length > 1) {
      const conditionedCount = outgoing.filter((edge) => edge.data?.condition?.trim()).length
      if (conditionedCount === 0) {
        issues.push({
          level: 'warning',
          message: `Node "${node.id}" has multiple branches without edge conditions.`,
        })
      }
    }

    if (node.data.type === 'task' && !node.data.title.trim()) {
      issues.push({
        level: 'error',
        message: `Task node "${node.id}" requires a title.`,
      })
    }
  })

  if (detectCycle(nodes, edges)) {
    issues.push({
      level: 'error',
      message: 'Workflow contains at least one cycle.',
    })
  }

  return issues
}
