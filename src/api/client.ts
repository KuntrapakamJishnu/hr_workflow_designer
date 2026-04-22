import type { AutomatedAction, SimulationRequest, SimulationResponse } from '../types/workflow'

export const fetchAutomations = async (): Promise<AutomatedAction[]> => {
  const response = await fetch('/automations')
  if (!response.ok) {
    throw new Error('Failed to fetch automations')
  }

  return response.json() as Promise<AutomatedAction[]>
}

export const simulateWorkflow = async (payload: SimulationRequest): Promise<SimulationResponse> => {
  const response = await fetch('/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Workflow simulation failed')
  }

  return response.json() as Promise<SimulationResponse>
}
