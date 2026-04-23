import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEventHandler,
} from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { EdgeEditorPanel } from './components/forms/EdgeEditorPanel'
import { NodeEditorPanel } from './components/forms/NodeEditorPanel'
import { SandboxPanel } from './components/sandbox/SandboxPanel'
import { ShortcutOverlay } from './components/sandbox/ShortcutOverlay'
import { TourOverlay } from './components/sandbox/TourOverlay'
import { NodePalette } from './components/sidebar/NodePalette'
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas'
import { useAutomations } from './hooks/useAutomations'
import { useWorkflowDesigner } from './hooks/useWorkflowDesigner'
import { parseWorkflowPayload, serializeWorkflowPayload } from './utils/workflowStorage'
import './App.css'

type AppTheme = 'warm' | 'ocean' | 'executive'

const THEME_STORAGE_KEY = 'hr-workflow-designer-theme'
const TOUR_DISMISSED_STORAGE_KEY = 'hr-workflow-designer-tour-dismissed'

const TOUR_STEPS = [
  {
    title: 'Build Your Flow',
    description:
      'Drag nodes from the left palette onto the canvas. Connect nodes to define your HR process path.',
  },
  {
    title: 'Configure Details',
    description:
      'Click a node to edit its form fields. Click an edge to set a branch condition or choose a quick preset.',
  },
  {
    title: 'Test Scenarios',
    description:
      'Use the sandbox panel to provide simulation context JSON and run path-based execution to validate outcomes.',
  },
  {
    title: 'Save and Share',
    description:
      'Your workflow autosaves locally. Export JSON to share and import JSON to restore or compare workflow versions.',
  },
]

function App() {
  const {
    nodes,
    edges,
    notice,
    selectedNode,
    selectedEdge,
    validationIssues,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    selectEdge,
    updateNodeData,
    updateEdgeCondition,
    removeSelectedNode,
    removeSelectedEdge,
    importWorkflow,
    setNotice,
  } = useWorkflowDesigner()

  const { automations, loading, error } = useAutomations()
  const importInputRef = useRef<HTMLInputElement | null>(null)
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window === 'undefined') {
      return 'warm'
    }

    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'ocean' || saved === 'executive' || saved === 'warm') {
      return saved
    }

    return 'warm'
  })
  const [isTourOpen, setIsTourOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(TOUR_DISMISSED_STORAGE_KEY) !== 'true'
  })
  const [isShortcutOpen, setIsShortcutOpen] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const openTour = () => {
    setTourStep(0)
    setIsTourOpen(true)
  }

  const closeTour = () => {
    setIsTourOpen(false)
    window.localStorage.setItem(TOUR_DISMISSED_STORAGE_KEY, 'true')
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typingInField =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable

      if (event.key === 'Escape') {
        setIsShortcutOpen(false)
        setIsTourOpen(false)
        return
      }

      if (typingInField) {
        return
      }

      if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
        event.preventDefault()
        setIsShortcutOpen(true)
      }

      if (event.key.toLowerCase() === 't') {
        event.preventDefault()
        openTour()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const stats = useMemo(() => {
    const errorsCount = validationIssues.filter((issue) => issue.level === 'error').length
    const warningsCount = validationIssues.filter((issue) => issue.level === 'warning').length
    const conditionalEdges = edges.filter((edge) => edge.data?.condition?.trim()).length

    return {
      nodes: nodes.length,
      edges: edges.length,
      conditionalEdges,
      errorsCount,
      warningsCount,
    }
  }, [nodes, edges, validationIssues])

  const handleExport = () => {
    const json = serializeWorkflowPayload({ nodes, edges })
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'workflow.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    importInputRef.current?.click()
  }

  const handleImportFile: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const text = await file.text()
    const parsed = parseWorkflowPayload(text)

    if (!parsed) {
      setNotice('Invalid workflow JSON file.')
      event.target.value = ''
      return
    }

    importWorkflow(parsed)
    event.target.value = ''
  }

  return (
    <ReactFlowProvider>
      <main className="app-shell">
        <header className="app-header">
          <div className="header-row">
            <div>
              <h1>✨ HR Workflow Designer</h1>
              <p>Build sophisticated HR processes with visual workflow design. Test scenarios, validate logic, and simulate real-world execution paths.</p>
              <div className="header-stats">
                <span className="header-chip">🟢 Nodes: {stats.nodes}</span>
                <span className="header-chip">🔗 Edges: {stats.edges}</span>
                <span className="header-chip">⚙️ Paths: {stats.conditionalEdges}</span>
                <span className={`header-chip ${stats.errorsCount > 0 ? 'error' : 'ok'}`}>
                  {stats.errorsCount > 0 ? '❌' : '✅'} Errors: {stats.errorsCount}
                </span>
                <span className={`header-chip ${stats.warningsCount > 0 ? 'warning' : 'ok'}`}>
                  {stats.warningsCount > 0 ? '⚠️' : '✓'} Warnings: {stats.warningsCount}
                </span>
              </div>
            </div>
            <div className="toolbar-row">
              <label className="theme-picker" aria-label="Theme selector">
                <span>🎨 Theme</span>
                <select
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as AppTheme)}
                >
                  <option value="warm">Warm</option>
                  <option value="ocean">Ocean</option>
                  <option value="executive">Executive</option>
                </select>
              </label>
              <button type="button" className="small-btn" onClick={handleExport}>
                📥 Export JSON
              </button>
              <button type="button" className="small-btn" onClick={handleImportClick}>
                📤 Import JSON
              </button>
              <button type="button" className="small-btn" onClick={() => setNotice(null)}>
                ✕ Clear Notice
              </button>
              <button type="button" className="small-btn" onClick={openTour}>
                🎯 Start Tour
              </button>
              <button type="button" className="small-btn" onClick={() => setIsShortcutOpen(true)}>
                ⌨️ Shortcuts
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json"
                onChange={handleImportFile}
                className="hidden-file-input"
              />
            </div>
          </div>
        </header>

        {notice && <div className="notice warning">{notice}</div>}
        {error && <div className="notice error">Automation API Error: {error}</div>}

        <section className="layout-grid">
          <NodePalette onClearNotice={() => setNotice(null)} theme={theme} />

          <WorkflowCanvas
            theme={theme}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeSelect={selectNode}
            onEdgeSelect={selectEdge}
            onAddNode={addNode}
            highlightedNodeId={highlightedNodeId}
          />

          <div className="right-rail">
            <EdgeEditorPanel
              key={selectedEdge?.id ?? 'no-edge'}
              edge={selectedEdge}
              onUpdateCondition={updateEdgeCondition}
              onDelete={removeSelectedEdge}
            />
            <NodeEditorPanel
              node={selectedNode}
              automations={automations}
              onUpdate={updateNodeData}
              onDelete={removeSelectedNode}
            />
            <SandboxPanel
              nodes={nodes}
              edges={edges}
              validationIssues={validationIssues}
              onHighlightedNodeChange={setHighlightedNodeId}
            />
          </div>
        </section>

        <footer className="app-footer">
          <span>Automation actions loaded: {loading ? 'Loading...' : automations.length}</span>
          <span>Autosave enabled: workflow persists across refresh.</span>
          <span>Tip: Branches with conditions are highlighted in amber on canvas.</span>
        </footer>

        <TourOverlay
          open={isTourOpen}
          steps={TOUR_STEPS}
          currentStep={tourStep}
          onNext={() => setTourStep((value) => Math.min(value + 1, TOUR_STEPS.length - 1))}
          onPrevious={() => setTourStep((value) => Math.max(value - 1, 0))}
          onClose={closeTour}
        />

        <ShortcutOverlay open={isShortcutOpen} onClose={() => setIsShortcutOpen(false)} />
      </main>
    </ReactFlowProvider>
  )
}

export default App
