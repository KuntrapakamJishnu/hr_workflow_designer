import { useMemo, useState, useEffect } from 'react'
import { simulateWorkflow } from '../../api/client'
import type {
  WorkflowEdge,
  WorkflowNode,
  SimulationResponse,
  ValidationIssue,
} from '../../types/workflow'

type SandboxPanelProps = {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  validationIssues: ValidationIssue[]
  onHighlightedNodeChange?: (nodeId: string | null) => void
}

export const SandboxPanel = ({
  nodes,
  edges,
  validationIssues,
  onHighlightedNodeChange,
}: SandboxPanelProps) => {
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SimulationResponse | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null)
  const [contextText, setContextText] = useState(
    '{\n  "amount": 1200,\n  "approved": true,\n  "role": "Manager"\n}'
  )
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(1500)

  const blockingErrors = useMemo(
    () => validationIssues.filter((issue) => issue.level === 'error'),
    [validationIssues]
  )

  const resultSummary = useMemo(() => {
    if (!result) return null

    return {
      ok: result.steps.filter((step) => step.status === 'ok').length,
      warning: result.steps.filter((step) => step.status === 'warning').length,
      error: result.steps.filter((step) => step.status === 'error').length,
    }
  }, [result])

  // Auto-play animation through simulation steps
  useEffect(() => {
    if (!result || currentStepIndex === null) return
    if (currentStepIndex >= result.steps.length) return

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => (prev !== null ? prev + 1 : null))
    }, autoPlaySpeed)

    return () => clearTimeout(timer)
  }, [result, currentStepIndex, autoPlaySpeed])

  // Notify parent when highlighted node changes
  useEffect(() => {
    if (!result || currentStepIndex === null) {
      onHighlightedNodeChange?.(null)
      return
    }
    if (currentStepIndex >= result.steps.length) {
      onHighlightedNodeChange?.(null)
      return
    }
    const step = result.steps[currentStepIndex]
    onHighlightedNodeChange?.(step.nodeId)
  }, [currentStepIndex, result, onHighlightedNodeChange])

  const runSimulation = async () => {
    setRunning(true)
    setError(null)
    setCurrentStepIndex(null)

    try {
      const context = JSON.parse(contextText) as Record<
        string,
        string | number | boolean
      >

      const response = await simulateWorkflow({ nodes, edges, context })
      setResult(response)
      // Start animation from first step
      if (response.steps.length > 0) {
        setCurrentStepIndex(0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected simulation error')
    } finally {
      setRunning(false)
    }
  }

  const stopAnimation = () => {
    setCurrentStepIndex(null)
  }

  return (
    <aside className="panel sandbox-panel">
      {/* Header */}
      <div className="sandbox-header">
        <h2>🧪 Workflow Simulation</h2>
        <button
          type="button"
          className="run-btn primary"
          onClick={runSimulation}
          disabled={running || blockingErrors.length > 0}
        >
          {running ? '⏳ Running...' : '▶ Run Simulation'}
        </button>
      </div>

      <p className="muted">
        Test your workflow with custom context values. Nodes highlight step-by-step as the simulation executes.
      </p>

      {/* Validation Issues */}
      {blockingErrors.length > 0 && (
        <div className="issues-box error-box">
          <strong>❌ Blocking Issues</strong>
          <ul>
            {blockingErrors.map((issue, index) => (
              <li key={`error-${index}`} className="error">
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Context Input */}
      <div className="context-section">
        <label className="label-strong">Simulation Context (JSON)</label>
        <textarea
          value={contextText}
          onChange={(event) => setContextText(event.target.value)}
          className="context-input"
          placeholder="Enter JSON object with variables..."
        />
      </div>

      {/* Runtime Error */}
      {error && (
        <div className="error-box">
          <p className="error-text">⚠️ Error: {error}</p>
        </div>
      )}

      {/* Simulation Result */}
      {result && (
        <div className="simulation-result">
          {/* Status Summary */}
          {resultSummary && (
            <div className="result-summary">
              <div className={`summary-card ${result.valid ? 'success' : 'warning'}`}>
                <div className="summary-title">
                  {result.valid ? '✅ Success' : '⚠️ Completed'}
                </div>
                <div className="summary-stats">
                  <div className="stat-badge ok">
                    <span className="stat-icon">✓</span>
                    <span>{resultSummary.ok} OK</span>
                  </div>
                  <div className="stat-badge warning">
                    <span className="stat-icon">⚠</span>
                    <span>{resultSummary.warning} Warnings</span>
                  </div>
                  <div className="stat-badge error">
                    <span className="stat-icon">✕</span>
                    <span>{resultSummary.error} Errors</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animation Controls */}
          {result.steps.length > 0 && currentStepIndex !== null && (
            <div className="animation-controls">
              <div className="step-progress">
                <span className="step-counter">
                  Step {currentStepIndex + 1} of {result.steps.length}
                </span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${((currentStepIndex + 1) / result.steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="animation-buttons">
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setCurrentStepIndex((prev) => (prev! > 0 ? prev! - 1 : 0))}
                  disabled={currentStepIndex === 0}
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  className="step-btn"
                  onClick={() => setCurrentStepIndex((prev) => (prev! < result.steps.length - 1 ? prev! + 1 : prev!))}
                  disabled={currentStepIndex >= result.steps.length - 1}
                >
                  Next →
                </button>
                <button
                  type="button"
                  className="step-btn secondary"
                  onClick={stopAnimation}
                >
                  Stop
                </button>
              </div>
              <label className="speed-control">
                Speed:
                <select value={autoPlaySpeed} onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}>
                  <option value={500}>Fast</option>
                  <option value={1500}>Normal</option>
                  <option value={3000}>Slow</option>
                </select>
              </label>
            </div>
          )}

          {/* Current Step Highlight */}
          {currentStepIndex !== null && result.steps[currentStepIndex] && (
            <div className="current-step-highlight">
              <div className="highlight-card">
                <div className="highlight-label">Currently Executing:</div>
                <div className="highlight-content">
                  <span className={`step-icon ${result.steps[currentStepIndex].status}`}>
                    {result.steps[currentStepIndex].status === 'ok' && '✓'}
                    {result.steps[currentStepIndex].status === 'warning' && '⚠'}
                    {result.steps[currentStepIndex].status === 'error' && '✕'}
                  </span>
                  <span className="highlight-text">{result.steps[currentStepIndex].message}</span>
                </div>
              </div>
            </div>
          )}

          {/* Simulation Issues */}
          {result.issues.length > 0 && (
            <div className="issues-box">
              <strong>⚠️ Issues During Simulation</strong>
              <ul>
                {result.issues.map((issue, index) => (
                  <li key={index} className={issue.level === 'error' ? 'error' : 'warning'}>
                    {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* All Steps */}
          <div className="steps-timeline">
            <strong>Execution Path</strong>
            <ol className="steps-list">
              {result.steps.map((step, index) => (
                <li
                  key={`${step.nodeId}-${step.index}`}
                  className={`step-item step-${step.status} ${index === currentStepIndex ? 'active' : ''}`}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <span className={`step-badge ${step.status}`}>
                    {step.status === 'ok' && '✓'}
                    {step.status === 'warning' && '⚠'}
                    {step.status === 'error' && '✕'}
                  </span>
                  <span className="step-text">{step.message}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </aside>
  )
}