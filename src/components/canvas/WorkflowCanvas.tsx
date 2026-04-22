import { useCallback, useMemo, useState } from 'react'
import type { DragEvent } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeMouseHandler,
  type EdgeChange,
  type NodeChange,
  type NodeMouseHandler,
  type XYPosition,
  useReactFlow,
} from '@xyflow/react'
import type { NodeType, WorkflowEdge, WorkflowNode } from '../../types/workflow'
import { WorkflowNodeCard } from '../nodes/WorkflowNodeCard'

type WorkflowCanvasProps = {
  theme: 'warm' | 'ocean' | 'executive'
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void
  onConnect: (connection: Connection) => void
  onNodeSelect: (nodeId: string | null) => void
  onEdgeSelect: (edgeId: string | null) => void
  onAddNode: (type: NodeType, position: XYPosition) => void
}

const nodeTypes = {
  workflowNode: WorkflowNodeCard,
}

export const WorkflowCanvas = ({
  theme,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onEdgeSelect,
  onAddNode,
}: WorkflowCanvasProps) => {
  const { screenToFlowPosition } = useReactFlow()
  const [dropBursts, setDropBursts] = useState<Array<{ id: number; x: number; y: number }>>([])

  const displayEdges = useMemo(() => {
    return edges.map((edge): Edge => {
      const hasCondition = Boolean(edge.data?.condition?.trim())

      return {
        ...edge,
        label: hasCondition ? edge.data?.condition : 'default',
        animated: hasCondition,
        markerEnd: {
          type: 'arrowclosed',
          color: hasCondition ? '#d5851f' : '#4a6fa2',
        },
        style: {
          stroke: hasCondition ? '#d5851f' : '#4a6fa2',
          strokeWidth: hasCondition ? 2.5 : 2,
        },
        labelStyle: {
          fill: hasCondition ? '#915816' : '#2f4d75',
          fontWeight: 700,
          fontSize: 11,
        },
        labelBgPadding: [6, 3],
        labelBgBorderRadius: 6,
        labelBgStyle: {
          fill: hasCondition ? '#fff3df' : '#e5eef9',
          fillOpacity: 0.95,
        },
      }
    })
  }, [edges])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow') as NodeType
      if (!type) {
        return
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const burst = {
        id: Date.now(),
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      }

      setDropBursts((current) => [...current, burst])
      window.setTimeout(() => {
        setDropBursts((current) => current.filter((item) => item.id !== burst.id))
      }, 520)

      onAddNode(type, position)
    },
    [onAddNode, screenToFlowPosition],
  )

  const miniMapColor = useCallback(
    (node: WorkflowNode) => {
      const palette = {
        warm: {
          start: '#2f8f6e',
          task: '#2d81ba',
          approval: '#c98a20',
          automated: '#ab5f3d',
          end: '#4d5f8f',
        },
        ocean: {
          start: '#1b8ea4',
          task: '#136d98',
          approval: '#2a8fb0',
          automated: '#0f5f7f',
          end: '#2f4f8a',
        },
        executive: {
          start: '#3c6f5a',
          task: '#4f6c63',
          approval: '#8a6a3b',
          automated: '#5e6352',
          end: '#505c57',
        },
      }

      return palette[theme][node.data.type]
    },
    [theme],
  )

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleNodeClick: NodeMouseHandler<WorkflowNode> = (_event, node) => {
    onNodeSelect(node.id)
  }

  const handleEdgeClick: EdgeMouseHandler<WorkflowEdge> = (_event, edge) => {
    onEdgeSelect(edge.id)
  }

  return (
    <section className="canvas-shell" onDrop={onDrop} onDragOver={onDragOver}>
      {dropBursts.map((burst) => (
        <span
          key={burst.id}
          className="drop-burst"
          style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
          aria-hidden="true"
        />
      ))}

      <ReactFlow
        nodes={nodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={() => {
          onNodeSelect(null)
          onEdgeSelect(null)
        }}
        fitView
      >
        <Background gap={20} size={1} />
        <Controls />
        <MiniMap pannable zoomable nodeColor={miniMapColor} />
      </ReactFlow>
    </section>
  )
}
