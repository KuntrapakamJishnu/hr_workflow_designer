import type { AutomatedAction } from '../types/workflow'

export const AUTOMATIONS: AutomatedAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient'],
  },
  {
    id: 'notify_slack',
    label: 'Notify Slack',
    params: ['channel', 'message'],
  },
]
