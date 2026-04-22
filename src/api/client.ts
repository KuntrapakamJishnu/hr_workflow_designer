import { AUTOMATIONS } from './mockData'
import { simulateWorkflowPath as runWorkflowSimulation } from '../utils/workflowSimulation'
import type {
  AutomatedAction,
  SimulationRequest,
  SimulationResponse,
} from '../types/workflow'

// ✅ Use local data instead of API
export const fetchAutomations = async (): Promise<AutomatedAction[]> => {
  return Promise.resolve(AUTOMATIONS)
}

export const simulateWorkflow = async (
  payload: SimulationRequest
): Promise<SimulationResponse> => {
  return Promise.resolve(
    runWorkflowSimulation(payload, payload.context || {})
  )
}