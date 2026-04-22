import type { DragEvent } from 'react'
import { NODE_LABELS, type NodeType } from '../../types/workflow'

type AppTheme = 'warm' | 'ocean' | 'executive'

type NodePaletteProps = {
  onClearNotice: () => void
  theme: AppTheme
}

const NODE_TYPES: NodeType[] = ['start', 'task', 'approval', 'automated', 'end']

const NODE_DESCRIPTIONS: Record<NodeType, string> = {
  start: 'Entry point for every workflow',
  task: 'Human-owned task with assignee and due date',
  approval: 'Decision gate for manager/HRBP/director',
  automated: 'System action from automation catalog',
  end: 'Terminal state with optional summary flag',
}

const THEME_ICONS: Record<AppTheme, Record<NodeType, string>> = {
  warm: {
    start: '>>',
    task: '[]',
    approval: '!?',
    automated: '##',
    end: '||',
  },
  ocean: {
    start: '>>',
    task: '<>',
    approval: '??',
    automated: '@@',
    end: 'XX',
  },
  executive: {
    start: 'GO',
    task: 'TK',
    approval: 'AP',
    automated: 'AU',
    end: 'DN',
  },
}

export const NodePalette = ({ onClearNotice, theme }: NodePaletteProps) => {
  const onDragStart = (event: DragEvent<HTMLButtonElement>, type: NodeType) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
    onClearNotice()
  }

  return (
    <aside className="panel palette-panel">
      <h2>Node Palette</h2>
      <p>Drag node types onto the canvas.</p>
      <div className="palette-list">
        {NODE_TYPES.map((type) => (
          <button
            key={type}
            className={`palette-item palette-${type}`}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
          >
            <span className="palette-icon">{THEME_ICONS[theme][type]}</span>
            <span className="palette-title">{NODE_LABELS[type]}</span>
            <span className="palette-subtitle">{NODE_DESCRIPTIONS[type]}</span>
          </button>
        ))}
      </div>
      <p className="muted">Double click canvas area to pan quickly and zoom with mouse wheel.</p>
    </aside>
  )
}
