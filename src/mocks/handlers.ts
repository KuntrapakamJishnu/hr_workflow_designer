import { http, HttpResponse } from 'msw'
import { AUTOMATIONS } from '../api/mockData'
import type {
  SimulationRequest,
  SimulationResponse,
} from '../types/workflow'
import { simulateWorkflowPath } from '../utils/workflowSimulation'

export const handlers = [
  http.get('/automations', () => {
    return HttpResponse.json(AUTOMATIONS)
  }),

  http.post('/simulate', async ({ request }) => {
    const payload = (await request.json()) as SimulationRequest
    const response: SimulationResponse = simulateWorkflowPath(
      {
        nodes: payload.nodes,
        edges: payload.edges,
      },
      payload.context ?? {},
    )

    return HttpResponse.json(response)
  }),
]
