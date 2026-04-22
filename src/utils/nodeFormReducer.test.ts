import { describe, expect, it } from 'vitest'
import {
  applyAutomatedActionParam,
  applyAutomatedActionSelection,
} from './nodeFormReducer'
import type { AutomatedAction, AutomatedNodeData } from '../types/workflow'

const baseData: AutomatedNodeData = {
  type: 'automated',
  title: 'Automated Action',
  actionId: 'send_email',
  actionParams: {
    to: 'a@company.com',
    subject: 'Hello',
    stale: 'remove',
  },
}

const sendEmail: AutomatedAction = {
  id: 'send_email',
  label: 'Send Email',
  params: ['to', 'subject'],
}

const generateDoc: AutomatedAction = {
  id: 'generate_doc',
  label: 'Generate Document',
  params: ['template', 'recipient'],
}

describe('nodeFormReducer', () => {
  it('keeps only selected action params and preserves matching values', () => {
    const next = applyAutomatedActionSelection(baseData, sendEmail)

    expect(next.actionId).toBe('send_email')
    expect(next.actionParams).toEqual({
      to: 'a@company.com',
      subject: 'Hello',
    })
  })

  it('resets params when switching to another action', () => {
    const next = applyAutomatedActionSelection(baseData, generateDoc)

    expect(next.actionId).toBe('generate_doc')
    expect(next.actionParams).toEqual({
      template: '',
      recipient: '',
    })
  })

  it('updates a single action parameter', () => {
    const next = applyAutomatedActionParam(baseData, 'subject', 'Updated Subject')

    expect(next.actionParams.subject).toBe('Updated Subject')
    expect(next.actionParams.to).toBe('a@company.com')
  })
})
