import { z } from 'zod'
import type { WorkflowEdge, WorkflowPayload } from '../types/workflow'

export const WORKFLOW_STORAGE_KEY = 'hr-workflow-designer-v1'

const keyValueSchema = z.object({
  key: z.string(),
  value: z.string(),
})

const nodeDataSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('start'),
    title: z.string(),
    metadata: z.array(keyValueSchema),
  }),
  z.object({
    type: z.literal('task'),
    title: z.string(),
    description: z.string(),
    assignee: z.string(),
    dueDate: z.string(),
    customFields: z.array(keyValueSchema),
  }),
  z.object({
    type: z.literal('approval'),
    title: z.string(),
    approverRole: z.string(),
    autoApproveThreshold: z.number(),
  }),
  z.object({
    type: z.literal('automated'),
    title: z.string(),
    actionId: z.string(),
    actionParams: z.record(z.string(), z.string()),
  }),
  z.object({
    type: z.literal('end'),
    endMessage: z.string(),
    summaryFlag: z.boolean(),
  }),
])

const nodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: nodeDataSchema,
})

const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  data: z
    .object({
      condition: z.string().optional(),
    })
    .optional(),
})

const payloadSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
})

const normalizeEdge = (edge: WorkflowEdge): WorkflowEdge => {
  const condition = edge.data?.condition?.trim() ?? ''
  return {
    ...edge,
    data: { condition },
    label: condition || undefined,
  }
}

export const normalizeWorkflowPayload = (payload: WorkflowPayload): WorkflowPayload => {
  return {
    nodes: payload.nodes,
    edges: payload.edges.map(normalizeEdge),
  }
}

export const serializeWorkflowPayload = (payload: WorkflowPayload): string => {
  return JSON.stringify(normalizeWorkflowPayload(payload), null, 2)
}

export const parseWorkflowPayload = (value: string): WorkflowPayload | null => {
  try {
    const parsed = payloadSchema.parse(JSON.parse(value))
    return normalizeWorkflowPayload(parsed as WorkflowPayload)
  } catch {
    return null
  }
}
