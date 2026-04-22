import { describe, expect, it } from 'vitest'
import type { WorkflowEdge, WorkflowNode } from '../types/workflow'
import { validateWorkflow } from './workflowValidation'

const makeNode = (node: WorkflowNode): WorkflowNode => node

const baseNodes: WorkflowNode[] = [
  makeNode({
    id: 'start-1',
    type: 'workflowNode',
    position: { x: 0, y: 0 },
    data: { type: 'start', title: 'Start', metadata: [] },
  }),
  makeNode({
    id: 'approval-1',
    type: 'workflowNode',
    position: { x: 100, y: 0 },
    data: { type: 'approval', title: 'Approve', approverRole: 'Manager', autoApproveThreshold: 0 },
  }),
  makeNode({
    id: 'end-1',
    type: 'workflowNode',
    position: { x: 200, y: -40 },
    data: { type: 'end', endMessage: 'Done A', summaryFlag: false },
  }),
  makeNode({
    id: 'end-2',
    type: 'workflowNode',
    position: { x: 200, y: 40 },
    data: { type: 'end', endMessage: 'Done B', summaryFlag: false },
  }),
]

describe('workflowValidation', () => {
  it('warns when a node has multiple outgoing branches without conditions', () => {
    const edges: WorkflowEdge[] = [
      { id: 'e1', source: 'start-1', target: 'approval-1' },
      { id: 'e2', source: 'approval-1', target: 'end-1' },
      { id: 'e3', source: 'approval-1', target: 'end-2' },
    ]

    const issues = validateWorkflow(baseNodes, edges)
    expect(issues.some((issue) => issue.message.includes('multiple branches without edge conditions'))).toBe(true)
  })

  it('flags cycle errors', () => {
    const edges: WorkflowEdge[] = [
      { id: 'e1', source: 'start-1', target: 'approval-1' },
      { id: 'e2', source: 'approval-1', target: 'start-1' },
      { id: 'e3', source: 'approval-1', target: 'end-1' },
    ]

    const issues = validateWorkflow(baseNodes, edges)
    expect(issues.some((issue) => issue.message.includes('contains at least one cycle'))).toBe(true)
  })

  it('flags edges that point to missing nodes', () => {
    const edges: WorkflowEdge[] = [
      { id: 'e1', source: 'start-1', target: 'approval-1' },
      { id: 'broken', source: 'missing-source', target: 'end-1' },
    ]

    const issues = validateWorkflow(baseNodes, edges)
    expect(issues.some((issue) => issue.message.includes('references an unknown node'))).toBe(true)
  })
})
