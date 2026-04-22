import { useMemo, useState } from 'react'
import { simulateWorkflow } from '../../api/client'
import type { WorkflowEdge, WorkflowNode, SimulationResponse, ValidationIssue } from '../../types/workflow'

type SandboxPanelProps = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  validationIssues: ValidationIssue[]
}

export const SandboxPanel = ({ nodes, edges, validationIssues }: SandboxPanelProps) => {
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SimulationResponse | null>(null)
  const [contextText, setContextText] = useState('{\n  "amount": 1200,\n  "approved": true,\n  "role": "Manager"\n}')

  const blockingErrors = useMemo(
    () => validationIssues.filter((issue) => issue.level === 'error'),
    [validationIssues],
  )

  const resultSummary = useMemo(() => {
    if (!result) {
      return null
    }

    return {
      ok: result.steps.filter((step) => step.status === 'ok').length,
      warning: result.steps.filter((step) => step.status === 'warning').length,
      error: result.steps.filter((step) => step.status === 'error').length,
    }
  }, [result])

  const runSimulation = async () => {
    setRunning(true)
    setError(null)

    try {
      const context = JSON.parse(contextText) as Record<string, string | number | boolean>
      const response = await simulateWorkflow({ nodes, edges, context })
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected simulation error')
    } finally {
      setRunning(false)
    }
  }

  return (
    <aside className="panel sandbox-panel">
      <div className="panel-row">
        <h2>Workflow Test Sandbox</h2>
        <button
          type="button"
          className="run-btn"
          onClick={runSimulation}
          disabled={running || blockingErrors.length > 0}
        >
          {running ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      <p className="muted">Serializes nodes + edges and calls POST /simulate.</p>

      <label>
        Simulation context (JSON)
        <textarea
          value={contextText}
          onChange={(event) => setContextText(event.target.value)}
          className="context-input"
        />
      </label>

      {validationIssues.length > 0 && (
        <div className="issues-box">
          <strong>Validation issues</strong>
          <ul>
            {validationIssues.map((issue, index) => (
              <li key={`${issue.level}-${index}`} className={issue.level === 'error' ? 'error' : 'warning'}>
                {issue.level.toUpperCase()}: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p className="error-text">Simulation Error: {error}</p>}

      {result && (
        <div className="simulation-result">
          <strong>{result.valid ? 'Simulation completed' : 'Simulation completed with issues'}</strong>

          {resultSummary && (
            <div className="result-stats">
              <span className="stat-chip ok">OK: {resultSummary.ok}</span>
              <span className="stat-chip warning">Warnings: {resultSummary.warning}</span>
              <span className="stat-chip error">Errors: {resultSummary.error}</span>
            </div>
          )}

          <ol>
            {result.steps.map((step) => (
              <li key={`${step.nodeId}-${step.index}`} className={`step-${step.status}`}>
                <span className={`step-badge ${step.status}`}>{step.status.toUpperCase()}</span>{' '}
                Step {step.index}: {step.message}
              </li>
            ))}
          </ol>
        </div>
      )}
    </aside>
  )
}
