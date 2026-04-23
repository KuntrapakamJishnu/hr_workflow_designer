# ✨ HR Workflow Designer

> **Build sophisticated HR workflows visually. Design, test, and simulate real-world execution paths with step-by-step visual feedback.**

![Workflow Designer](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

A professional-grade visual workflow designer for HR processes. Create complex workflows with conditional routing, role-based approvals, and automated actions. Test scenarios instantly with an interactive simulation engine that highlights execution paths step-by-step.

**Perfect for:** Onboarding processes, leave request workflows, document verification, approval chains, and HR automation rules.

---

## ✨ Key Features

### 🎨 **Visual Workflow Canvas**
- Drag & drop node-based workflow builder
- 5 node types: Start → Task → Approval → Automated → End
- Smart edge connections with conditional routing
- Real-time validation with error/warning indicators
- Full undo/redo support via localStorage

### 🧪 **Interactive Simulation Engine** (Premium Feature)
- **Step-by-step execution visualization** - Watch nodes highlight as the workflow executes
- **Progress tracking** - See exactly where you are in the path (Step 3 of 8)
- **Playback controls** - Play, Pause, Previous, Next, Stop
- **Speed control** - Adjust animation speed (Fast/Normal/Slow)
- **Result summary** - Status badges showing ✓ OK, ⚠️ Warnings, ✕ Errors
- **Interactive timeline** - Click any step to jump to it instantly

### 🔧 **Powerful Node Types**

| Node | Purpose | Features |
|------|---------|----------|
| **Start** | Workflow entry | Metadata key-value pairs |
| **Task** | Manual work step | Assignee, due date, custom fields |
| **Approval** | Role-based approval | Approver role, auto-approve threshold |
| **Automated** | API integration | Dynamic action parameters |
| **End** | Completion point | End message, summary flag |

### ⚙️ **Conditional Routing**
- Branch logic with simple expressions: `amount >= 1000`, `role == "Manager"`, etc.
- Dynamic context evaluation based on workflow inputs
- Visual highlighting of conditional branches in amber
- Preset conditions for common scenarios

### 💾 **Persistence & Export**
- Auto-save to browser localStorage
- JSON import/export for sharing workflows
- Version control friendly format

### ✅ **Smart Validation**
- Ensures exactly one Start node
- Requires at least one End node
- Detects cycles and broken connections
- Warns on multiple conditional branches
- Real-time validation feedback

### 🎨 **Premium UI/UX**
- Modern gradient-based design with smooth animations
- Three theme options: Warm, Ocean, Executive
- Responsive layout (desktop, tablet, mobile)
- Keyboard shortcuts for power users
- Interactive tour for new users

---

## 🚀 Live Demo

**Try it now:** https://hr-workflow-designer-pi-two.vercel.app/

1. **Design** a workflow by dragging nodes onto the canvas
2. **Configure** each node with your specific details
3. **Set conditions** on edges to create branching logic
4. **Run Simulation** and watch the execution path light up step-by-step
5. **Export/Import** workflows as JSON files

---

## 📋 What's Implemented

✅ Workflow canvas with React Flow integration  
✅ 5 fully-featured node types with custom configuration forms  
✅ Conditional edge routing with expression evaluation  
✅ Real-time validation engine with cycle detection  
✅ Visual simulation with step-by-step execution highlighting  
✅ Playback controls and speed adjustment  
✅ Interactive step timeline navigation  
✅ Modern premium UI with three themes  
✅ Local persistence via localStorage  
✅ JSON import/export  
✅ Mock API integration (MSW)  
✅ Comprehensive unit tests (validation, simulation, forms)  
✅ TypeScript with strict mode  
✅ Responsive design  
✅ Keyboard shortcuts and interactive tour  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript (Strict Mode) |
| **Build Tool** | Vite |
| **Graph Visualization** | @xyflow/react (React Flow) |
| **API Mocking** | Mock Service Worker (MSW) |
| **Styling** | CSS3 (Gradients, Animations, Flexbox) |
| **Testing** | Vitest |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── api/
│   ├── client.ts              # API fetch wrappers
│   └── mockData.ts            # Mock automation definitions
├── components/
│   ├── canvas/
│   │   └── WorkflowCanvas.tsx # React Flow + drag-drop handler
│   ├── forms/
│   │   ├── EdgeEditorPanel.tsx    # Condition expression editor
│   │   ├── KeyValueEditor.tsx     # Reusable k-v editor
│   │   └── NodeEditorPanel.tsx    # Dynamic form by node type
│   ├── nodes/
│   │   └── WorkflowNodeCard.tsx   # Custom node UI
│   ├── sandbox/
│   │   └── SandboxPanel.tsx       # Simulation engine + playback UI
│   └── sidebar/
│       └── NodePalette.tsx        # Draggable node palette
├── hooks/
│   ├── useAutomations.ts          # Load automation actions
│   └── useWorkflowDesigner.ts     # Canvas state & logic
├── mocks/
│   ├── browser.ts                 # MSW setup
│   └── handlers.ts                # Mock /simulate endpoint
├── types/
│   └── workflow.ts                # Shared TypeScript types
├── utils/
│   ├── edgeCondition.ts           # Condition parser
│   ├── nodeFormReducer.ts         # Form state logic
│   ├── workflowSimulation.ts      # Execution engine
│   ├── workflowStorage.ts         # Persistence helpers
│   └── workflowValidation.ts      # Graph validation
├── App.tsx
├── App.css
├── main.tsx
└── index.css
```

---

## 🚀 Getting Started

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

---

## 🚀 Getting Started

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/KuntrapakamJishnu/hr_workflow_designer.git
cd hr-workflow-designer

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open http://localhost:5173 in your browser
```

### Development Commands

```bash
# Run dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run unit tests
npm run test

# Type check
npm run type-check

# Lint TypeScript files
npm run lint
```

---

## 💡 How to Use

### 1. **Design Your Workflow**
- Drag nodes from the left panel onto the canvas
- Click to select nodes or edges
- Use the right panel to configure each node

### 2. **Set Up Conditional Routing**
- Click an edge to select it
- Enter a condition: `role == "Manager"`, `amount >= 1000`, etc.
- Use operators: `==`, `!=`, `>`, `<`, `>=`, `<=`

### 3. **Run Simulation**
- Enter test context in the Sandbox panel (JSON format)
- Click "Run Simulation"
- Watch nodes highlight step-by-step
- Use playback controls to navigate through execution

### 4. **Export & Share**
- Click "Export JSON" to save your workflow
- Share the JSON file or import it later
- Use version control to track changes

---

## 🔍 Advanced Features

### Condition Expression Format

Simple, readable expressions for branch logic:

```
amount >= 1000              # numeric comparison
role == "Manager"           # string comparison
approved != false           # boolean comparison
department >= "HR"          # alphabetic comparison
```

### Simulation Context

Provide dynamic values during simulation:

```json
{
  "amount": 5000,
  "role": "Manager",
  "department": "HR",
  "approved": true
}
```

### Validation Rules

The engine enforces these rules automatically:

- ✅ Exactly **one Start node** per workflow
- ✅ At least **one End node**
- ✅ **No incoming edges** to Start nodes
- ✅ **No cycles** in the graph
- ✅ **All edges** point to valid nodes
- ✅ **Task nodes** must have titles
- ✅ **Multiple branches** should have conditions

---

## 📊 API Contract (Mocked)

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

---

## 🏗️ Architecture & Design Decisions

### State Management
- **useWorkflowDesigner** hook encapsulates all canvas logic and validation
- UI components stay focused on presentation
- Easy to test state transitions independently

### Type Safety
- Discriminated unions for node types (`StartNodeData | TaskNodeData | ...`)
- Forms are type-safe and extensible without runtime checks
- Full TypeScript strict mode compliance

### API Layer
- Abstracted API calls into `client.ts`
- Mock Service Worker for zero-setup testing
- Easy backend swap when moving to production

### Form Architecture
- Reusable `KeyValueEditor` for metadata and custom fields
- Reducer pattern for complex form state (automated actions)
- Each node type has dedicated configuration logic

### Condition Parsing
- Simple expression parser (`edgeCondition.ts`)
- Supports numeric, string, and boolean comparisons
- Easy to extend with additional operators

### Persistence Strategy
- Central serialization helpers in `workflowStorage.ts`
- localStorage for auto-save
- JSON format for version control and sharing
- No database dependencies

---

## 🧪 Testing

The project includes comprehensive unit tests:

```bash
npm run test
```

**Test Coverage:**
- ✅ Workflow validation rules
- ✅ Simulation path traversal
- ✅ Condition evaluation
- ✅ Form reducer logic
- ✅ Edge cases and error scenarios

---

## 🎯 Key Achievements

| Feature | Impact |
|---------|--------|
| **Visual Simulation** | See workflows execute step-by-step in real-time |
| **Conditional Routing** | Create complex business logic with simple expressions |
| **Full Validation** | Catch design errors before simulation |
| **Type Safe** | Reduce runtime errors with strict TypeScript |
| **Zero Setup** | Mock API requires no backend |
| **Portable** | Export/import workflows as JSON |
| **Responsive** | Works on desktop, tablet, and mobile |
| **Premium UI** | Production-ready design with animations |

---

## 🚀 Future Enhancements

- [ ] Visual condition builder (drag-and-drop instead of free-text)
- [ ] Richer simulation traces (per-node output payloads)
- [ ] Undo/Redo history with time-travel debugging
- [ ] Workflow templates for common HR scenarios
- [ ] Real backend persistence with authentication
- [ ] Export to visual diagram (PNG/SVG)
- [ ] Workflow analytics (most used paths, bottlenecks)
- [ ] Multi-user collaboration mode
- [ ] Advanced search and filtering
- [ ] Workflow versioning and comparison

---

## 📝 License

MIT © 2025

---

## 🤝 Contributing

Contributions welcome! Feel free to open issues or PRs.

---

## 💬 Questions?

For documentation or issues, check the [GitHub repository](https://github.com/KuntrapakamJishnu/hr_workflow_designer).

**Live Demo:** https://hr-workflow-designer-pi-two.vercel.app/

Enjoy building workflows! 🚀
