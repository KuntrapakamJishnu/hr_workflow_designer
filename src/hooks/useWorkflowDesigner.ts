import { useEffect, useMemo, useState } from 'react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type XYPosition,
} from '@xyflow/react'
import {
  createNodeDataByType,
  type NodeType,
  type WorkflowPayload,
  type WorkflowEdge,
  type WorkflowNode,
  type WorkflowNodeData,
} from '../types/workflow'
import { validateWorkflow } from '../utils/workflowValidation'
import {
  parseWorkflowPayload,
  serializeWorkflowPayload,
  WORKFLOW_STORAGE_KEY,
} from '../utils/workflowStorage'

const initialNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'workflowNode',
    position: { x: 150, y: 80 },
    data: createNodeDataByType('start'),
  },
  {
    id: 'task-1',
    type: 'workflowNode',
    position: { x: 450, y: 80 },
    data: createNodeDataByType('task'),
  },
  {
    id: 'end-1',
    type: 'workflowNode',
    position: { x: 750, y: 80 },
    data: createNodeDataByType('end'),
  },
]

const initialEdges: WorkflowEdge[] = [
  { id: 'e-start-task', source: 'start-1', target: 'task-1', data: { condition: '' } },
  { id: 'e-task-end', source: 'task-1', target: 'end-1', data: { condition: '' } },
]

let sequence = 2

const nextNodeId = (type: NodeType) => {
  sequence += 1
  return `${type}-${sequence}`
}

export const useWorkflowDesigner = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(() => {
    if (typeof window === 'undefined') {
      return initialNodes
    }

    const saved = window.localStorage.getItem(WORKFLOW_STORAGE_KEY)
    if (!saved) {
      return initialNodes
    }

    const parsed = parseWorkflowPayload(saved)
    return parsed?.nodes ?? initialNodes
  })
  const [edges, setEdges] = useState<WorkflowEdge[]>(() => {
    if (typeof window === 'undefined') {
      return initialEdges
    }

    const saved = window.localStorage.getItem(WORKFLOW_STORAGE_KEY)
    if (!saved) {
      return initialEdges
    }

    const parsed = parseWorkflowPayload(saved)
    return parsed?.edges ?? initialEdges
  })
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const onNodesChange = (changes: NodeChange<WorkflowNode>[]) => {
    setNodes((current) => applyNodeChanges(changes, current))
  }

  const onEdgesChange = (changes: EdgeChange<WorkflowEdge>[]) => {
    setEdges((current) => applyEdgeChanges(changes, current))
  }

  const onConnect = (connection: Connection) => {
    const edgeWithCondition: WorkflowEdge = {
      ...connection,
      id: `e-${Date.now()}`,
      data: { condition: '' },
    }

    setEdges((current) => addEdge(edgeWithCondition, current))
  }

  const addNode = (type: NodeType, position: XYPosition) => {
    if (type === 'start' && nodes.some((node) => node.data.type === 'start')) {
      setNotice('Only one Start node is allowed.')
      return
    }

    setNotice(null)

    const node: WorkflowNode = {
      id: nextNodeId(type),
      type: 'workflowNode',
      position,
      data: createNodeDataByType(type),
    }

    setNodes((current) => [...current, node])
  }

  const selectNode = (nodeId: string | null) => {
    setSelectedEdgeId(null)
    setSelectedNodeId(nodeId)
  }

  const selectEdge = (edgeId: string | null) => {
    setSelectedNodeId(null)
    setSelectedEdgeId(edgeId)
  }

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  )

  const selectedEdge = useMemo(
    () => edges.find((edge) => edge.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  )

  const updateNodeData = (nodeId: string, nextData: WorkflowNodeData) => {
    setNodes((current) =>
      current.map((node) => (node.id === nodeId ? { ...node, data: nextData } : node)),
    )
  }

  const removeSelectedNode = () => {
    if (!selectedNodeId) {
      return
    }

    setNodes((current) => current.filter((node) => node.id !== selectedNodeId))
    setEdges((current) =>
      current.filter(
        (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId,
      ),
    )
    setSelectedNodeId(null)
  }

  const updateEdgeCondition = (edgeId: string, condition: string) => {
    setEdges((current) =>
      current.map((edge) =>
        edge.id === edgeId
          ? {
              ...edge,
              data: { condition },
              label: condition.trim() || undefined,
            }
          : edge,
      ),
    )
  }

  const removeSelectedEdge = () => {
    if (!selectedEdgeId) {
      return
    }

    setEdges((current) => current.filter((edge) => edge.id !== selectedEdgeId))
    setSelectedEdgeId(null)
  }

  const importWorkflow = (payload: WorkflowPayload) => {
    setNodes(payload.nodes)
    setEdges(payload.edges)
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setNotice('Workflow imported successfully.')
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      WORKFLOW_STORAGE_KEY,
      serializeWorkflowPayload({
        nodes,
        edges,
      }),
    )
  }, [nodes, edges])

  const validationIssues = useMemo(() => validateWorkflow(nodes, edges), [nodes, edges])

  return {
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
  }
}
