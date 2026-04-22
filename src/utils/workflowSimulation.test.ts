import { describe, expect, it } from 'vitest'
import type { WorkflowPayload } from '../types/workflow'
import { simulateWorkflowPath } from './workflowSimulation'

const payload: WorkflowPayload = {
  nodes: [
    {
      id: 'start-1',
      type: 'workflowNode',
      position: { x: 0, y: 0 },
      data: { type: 'start', title: 'Start', metadata: [] },
    },
    {
      id: 'approval-1',
      type: 'workflowNode',
      position: { x: 120, y: 0 },
      data: { type: 'approval', title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 },
    },
    {
      id: 'end-low',
      type: 'workflowNode',
      position: { x: 240, y: -40 },
      data: { type: 'end', endMessage: 'Low path', summaryFlag: false },
    },
    {
      id: 'end-high',
      type: 'workflowNode',
      position: { x: 240, y: 40 },
      data: { type: 'end', endMessage: 'High path', summaryFlag: true },
    },
  ],
  edges: [
    { id: 'e1', source: 'start-1', target: 'approval-1' },
    { id: 'e2', source: 'approval-1', target: 'end-high', data: { condition: 'amount >= 1000' } },
    { id: 'e3', source: 'approval-1', target: 'end-low' },
  ],
}

describe('workflowSimulation', () => {
  it('takes matching conditional branch when condition evaluates true', () => {
    const result = simulateWorkflowPath(payload, { amount: 1500 })
    const route = result.steps.map((step) => step.message).join(' | ')

    expect(result.valid).toBe(true)
    expect(route).toContain('end-high')
    expect(route).not.toContain('end-low')
  })

  it('falls back to default branch when no condition matches', () => {
    const result = simulateWorkflowPath(payload, { amount: 200 })
    const route = result.steps.map((step) => step.message).join(' | ')

    expect(result.valid).toBe(true)
    expect(route).toContain('end-low')
  })
})
