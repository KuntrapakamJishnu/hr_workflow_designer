import { AUTOMATIONS } from './mockData'
import { simulateWorkflowPath } from '../utils/workflowSimulation'

import type {
  AutomatedAction,
  SimulationRequest,
  SimulationResponse,
} from '../types/workflow'

export const fetchAutomations = async (): Promise<AutomatedAction[]> => {
  return AUTOMATIONS
}

export const simulateWorkflow = async (
  payload: SimulationRequest
): Promise<SimulationResponse> => {
  return simulateWorkflowPath(payload, payload.context || {})
}