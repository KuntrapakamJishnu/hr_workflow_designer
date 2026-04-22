import type {
  SimulationResponse,
  WorkflowEdge,
  WorkflowNode,
  WorkflowPayload,
  WorkflowSimulationStep,
} from '../types/workflow'
import { parseEdgeConditionExpression } from './edgeCondition'
import { validateWorkflow } from './workflowValidation'

type SimulationContext = Record<string, string | number | boolean>

export const evaluateEdgeCondition = (
  condition: string | undefined,
  context: SimulationContext,
): boolean => {
  if (!condition || !condition.trim()) {
    return true
  }

  const parsed = parseEdgeConditionExpression(condition.trim())
  if (!parsed) {
    return false
  }

  const left = context[parsed.key]
  const right =
    parsed.valueType === 'boolean'
      ? parsed.value === 'true'
      : parsed.valueType === 'number'
        ? Number(parsed.value)
        : parsed.value

  if (left === undefined) {
    return false
  }

  if (parsed.operator === '==') return left === right
  if (parsed.operator === '!=') return left !== right

  if (typeof left !== 'number' || typeof right !== 'number') {
    return false
  }

  if (parsed.operator === '>') return left > right
  if (parsed.operator === '<') return left < right
  if (parsed.operator === '>=') return left >= right
  return left <= right
}

const chooseNextEdge = (edges: WorkflowEdge[], context: SimulationContext): WorkflowEdge | null => {
  if (edges.length === 0) {
    return null
  }

  const conditioned = edges.filter((edge) => edge.data?.condition?.trim())
  const match = conditioned.find((edge) => evaluateEdgeCondition(edge.data?.condition, context))
  if (match) {
    return match
  }

  return edges.find((edge) => !edge.data?.condition?.trim()) ?? null
}

export const simulateWorkflowPath = (
  payload: WorkflowPayload,
  context: SimulationContext,
): SimulationResponse => {
  const issues = validateWorkflow(payload.nodes, payload.edges)
  const valid = !issues.some((issue) => issue.level === 'error')

  if (!valid) {
    return { valid, issues, steps: [] }
  }

  const nodeMap = new Map(payload.nodes.map((node) => [node.id, node]))
  const outgoingMap = new Map<string, WorkflowEdge[]>()

  for (const edge of payload.edges) {
    const list = outgoingMap.get(edge.source) ?? []
    list.push(edge)
    outgoingMap.set(edge.source, list)
  }

  const startNode = payload.nodes.find((node) => node.data.type === 'start')
  if (!startNode) {
    return {
      valid: false,
      issues: [{ level: 'error', message: 'Missing Start node for simulation.' }],
      steps: [],
    }
  }

  const steps: WorkflowSimulationStep[] = []
  let currentNode: WorkflowNode | undefined = startNode
  const maxSteps = payload.nodes.length * 5

  while (currentNode && steps.length < maxSteps) {
    const outgoing = outgoingMap.get(currentNode.id) ?? []
    const nextEdge = chooseNextEdge(outgoing, context)

    steps.push({
      index: steps.length + 1,
      nodeId: currentNode.id,
      nodeType: currentNode.data.type,
      status: 'ok',
      message: nextEdge
        ? `Visited ${currentNode.data.type} node ${currentNode.id} -> ${nextEdge.target}${nextEdge.data?.condition ? ` [${nextEdge.data.condition}]` : ''}`
        : `Visited ${currentNode.data.type} node ${currentNode.id}`,
    })

    if (currentNode.data.type === 'end') {
      break
    }

    if (!nextEdge) {
      steps.push({
        index: steps.length + 1,
        nodeId: currentNode.id,
        nodeType: currentNode.data.type,
        status: 'warning',
        message: `Execution stopped: no matching outgoing branch from ${currentNode.id}.`,
      })
      break
    }

    currentNode = nodeMap.get(nextEdge.target)
  }

  if (steps.length >= maxSteps) {
    steps.push({
      index: steps.length + 1,
      nodeId: currentNode?.id ?? 'unknown',
      nodeType: currentNode?.data.type ?? 'task',
      status: 'error',
      message: 'Execution stopped due to traversal limit.',
    })
  }

  return {
    valid,
    issues,
    steps,
  }
}
