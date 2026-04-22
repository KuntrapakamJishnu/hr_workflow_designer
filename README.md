# HR Workflow Designer Prototype

A modular React + React Flow prototype for visually building and testing HR workflows (onboarding, leave approvals, document verification).

## What Is Implemented

1. Workflow canvas (React Flow)
- Drag nodes from sidebar onto canvas
- Connect nodes with edges
- Select node to edit in a side panel
- Select edges to configure branch conditions
- Delete nodes using panel action
- Delete edges via React Flow selection + Delete/Backspace
- Local persistence via localStorage
- JSON import/export support

2. Node types
- Start node
- Task node
- Approval node
- Automated Step node
- End node

3. Node configuration forms
- Start: title, metadata key-value pairs
- Task: title, description, assignee, due date, custom key-value pairs
- Approval: title, approver role, auto-approve threshold
- Automated: title, action from API, dynamic action parameters
- End: end message, summary flag toggle

4. Mock API integration (MSW)
- GET /automations
- POST /simulate

5. Workflow sandbox panel
- Uses graph serialization (nodes + edges)
- Runs simulation via POST /simulate
- Accepts simulation context JSON (for condition evaluation)
- Shows validation issues and path-based execution log

6. Unit tests
- Validation rules unit tests
- Branch/path simulation unit tests
- Automated node form reducer unit tests

7. Validation rules
- Exactly one Start node
- At least one End node
- Start node cannot have incoming edges
- Missing incoming/outgoing connections are flagged
- Broken edges (unknown source/target) are flagged
- Branches without conditions are warned when multiple outgoing edges exist
- Cycle detection
- Task title requirement

## Tech Stack

- React 19 + TypeScript
- Vite
- @xyflow/react (React Flow)
- MSW for local mock API

## Project Structure

```bash
src/
  api/
    client.ts               # Fetch wrappers for /automations and /simulate
    mockData.ts             # Mock automation definitions
  components/
    canvas/
      WorkflowCanvas.tsx    # React Flow wrapper + DnD drop handling
    forms/
      EdgeEditorPanel.tsx   # Edit edge branch condition expressions
      KeyValueEditor.tsx    # Reusable key-value list editor
      NodeEditorPanel.tsx   # Dynamic form panel based on node type
    nodes/
      WorkflowNodeCard.tsx  # Custom node UI used by React Flow
    sandbox/
      SandboxPanel.tsx      # Run simulation and render logs/issues
    sidebar/
      NodePalette.tsx       # Draggable node palette
  hooks/
    useAutomations.ts       # Loads automated actions from mock API
    useWorkflowDesigner.ts  # Canvas state, selection, updates, validation
  mocks/
    browser.ts              # MSW worker setup
    handlers.ts             # /automations and /simulate handlers
  types/
    workflow.ts             # Node/data/interfaces/shared types
  utils/
    nodeFormReducer.ts      # Reducer helpers for automated node forms
    workflowSimulation.ts   # Path traversal and branch condition evaluation
    workflowStorage.ts      # Parse/serialize + local persistence helpers
    workflowValidation.ts   # Graph validation + cycle detection
```

## Run Locally

1. Install deps:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build:

```bash
npm run build
```

4. Run tests:

```bash
npm run test
```

## API Contract (Mocked)

GET /automations

```json
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] },
  { "id": "notify_slack", "label": "Notify Slack", "params": ["channel", "message"] }
]
```

POST /simulate

Request body includes:

```json
{
  "nodes": ["..."],
  "edges": ["..."],
  "context": {
    "amount": 1200,
    "approved": true,
    "role": "Manager"
  }
}
```

Response includes:
- valid flag
- issues array
- path-based execution log with selected branch notes

## Design Choices

- Kept graph/state logic in a dedicated hook to keep UI components focused.
- Used discriminated unions for node data to keep forms type-safe and extensible.
- Split API layer from UI and hooks for easy backend swap later.
- Used one reusable key-value editor for Start metadata and Task custom fields.
- Added condition parser for branch expressions using simple operators (==, !=, >, <, >=, <=).
- Added local persistence and import/export through central workflow serialization helpers.
- Extracted automated-node update logic into reducer utilities for testable form behavior.

## Assumptions

- One Start node is expected per workflow.
- Multiple End nodes are allowed.
- Simulation follows graph path from Start based on edge conditions and context.
- Edge condition format is intentionally simple (e.g., amount >= 1000).
- No backend persistence/authentication is required.

## Future Enhancements

- Add visual branch expression builder (instead of free-text conditions).
- Add richer simulation traces (per-node output payloads).
- Add undo/redo and versioning.
- Add server-side workflow persistence and version history.
