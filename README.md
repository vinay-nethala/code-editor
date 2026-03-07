# Advanced Browser-Based Code Editor
### VS Code-Style Keyboard Handling with Event Debugging Dashboard

---

# Project Overview

This project implements a **browser-based code editor** designed to replicate the **keyboard-driven interaction model used in modern developer tools** such as Visual Studio Code, Google Docs, and Notion.

The editor focuses on **advanced keyboard event handling**, **state management**, and **performance optimization** techniques required for building responsive web-based productivity applications.

The system demonstrates how modern browsers handle:

- Complex keyboard shortcuts
- Cross-platform modifier keys
- Undo/Redo state history
- Input event processing
- Multi-step chord shortcuts
- Debounced operations
- Real-time event visualization

To ensure consistent development and evaluation environments, the entire application is **fully containerized using Docker and Docker Compose**.

---

# Key Capabilities

### Editor Capabilities

The editor provides several features that simulate behavior found in modern IDEs:

- Real-time text editing
- Line indentation using **Tab**
- Line outdent using **Shift + Tab**
- Automatic indentation on **Enter**
- Comment toggle using **Ctrl / Cmd + /**
- Multi-step chord shortcuts
- Undo / Redo history management
- Cross-platform shortcut compatibility

---

### Event Debugging Dashboard

A **real-time debugging dashboard** visualizes keyboard events fired by the browser.

The dashboard logs the following events:

- `keydown`
- `keyup`
- `input`
- `compositionstart`
- `compositionupdate`
- `compositionend`

Each event entry includes:

- Event Type
- Key Value
- Key Code
- Modifier Key Status

This dashboard helps developers understand **how browser keyboard events propagate and interact**.

---

# Application Interface Architecture

The application is divided into two major components:

```
+------------------------------------------------------------+
|                        Code Editor                         |
|                                                            |
|   User writes or edits code here                           |
|                                                            |
|                                                            |
+-------------------------------+----------------------------+
                                |
                                |
                                v
                   +--------------------------------+
                   |       Event Debug Dashboard    |
                   |                                |
                   | keydown : key = a              |
                   | keyup   : key = a              |
                   | input   : text inserted        |
                   | Action  : Save Triggered       |
                   +--------------------------------+
```

---

# System Architecture Diagram

```mermaid
flowchart TB
    A[User Keyboard Input] --> B[Keyboard Event Listeners]

    B --> C[keydown Handler]
    B --> D[input Handler]
    B --> E[keyup Handler]

    C --> F[Shortcut Detection Engine]
    F --> G[Save Shortcut]
    F --> H[Undo / Redo Manager]
    F --> I[Comment Toggle]
    F --> J[Chord Shortcut Manager]

    D --> K[Text State Manager]

    K --> L[Editor Content Update]

    L --> M[Undo Stack]
    L --> N[Redo Stack]

    C --> O[Event Logger]
    D --> O
    E --> O

    O --> P[Event Debug Dashboard]
```

---

# Editor State Management Architecture

The editor uses a **history stack model** to support Undo and Redo operations.

```mermaid
flowchart LR
    A[User Typing] --> B[Push Previous State to Undo Stack]
    B --> C[Clear Redo Stack]
    C --> D[Update Editor Content]

    E[Undo Command] --> F[Pop Undo Stack]
    F --> G[Move Current State to Redo Stack]
    G --> H[Restore Previous Content]

    I[Redo Command] --> J[Pop Redo Stack]
    J --> K[Move Current State to Undo Stack]
    K --> L[Restore Next State]
```

---

# Keyboard Shortcut Processing Pipeline

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Editor
    participant ShortcutEngine
    participant StateManager
    participant Dashboard

    User->>Browser: Press Keyboard Key
    Browser->>Editor: Dispatch keydown event
    Editor->>ShortcutEngine: Check shortcut combination

    ShortcutEngine->>StateManager: Execute editor action
    StateManager->>Editor: Update content

    Editor->>Dashboard: Log keyboard event
```

---

# Chord Shortcut State Machine

The editor supports **multi-step shortcuts** such as:

**Ctrl + K → Ctrl + C**

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> ChordStarted : Ctrl + K pressed

    ChordStarted --> Success : Ctrl + C within 2 seconds
    ChordStarted --> Timeout : No key within 2 seconds
    ChordStarted --> Reset : Other key pressed

    Success --> Idle
    Timeout --> Idle
    Reset --> Idle
```

---

# Debounced Syntax Highlighting Flow

Syntax highlighting is simulated as a **computationally expensive operation**.

To avoid performance degradation during rapid typing, the highlight logic is **debounced**.

```mermaid
flowchart TD
    A[User Typing Rapidly] --> B[input events fired repeatedly]

    B --> C[Debounce Timer Reset]

    C --> D[User Stops Typing]

    D --> E[150ms Delay]

    E --> F[Execute Syntax Highlighting Once]
```

---

# Event Debugging Workflow

```mermaid
flowchart LR
    A[Keyboard Event] --> B[Capture Event Data]

    B --> C[Extract Event Type]
    B --> D[Extract Key Value]
    B --> E[Check Modifier Keys]

    C --> F[Create Log Entry]
    D --> F
    E --> F

    F --> G[Append to Event Dashboard]
```

---

# Project Directory Structure

```
project-root
│
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
├── README.md
│
└── src
   
```

---

# Supported Keyboard Shortcuts

| Shortcut | Action |
|--------|--------|
| Ctrl / Cmd + S | Trigger save action |
| Ctrl / Cmd + Z | Undo last change |
| Ctrl / Cmd + Shift + Z | Redo change |
| Ctrl / Cmd + / | Toggle line comment |
| Tab | Indent line |
| Shift + Tab | Outdent line |
| Enter | Create new line with same indentation |
| Ctrl + K then Ctrl + C | Execute chord shortcut |

---

# Global Verification Functions

To support automated evaluation, specific internal functions are exposed on the global window object.

### Editor State Inspection

```
window.getEditorState()
```

Returns:

```
{
  content: string,
  historySize: number
}
```

---

### Syntax Highlight Call Counter

```
window.getHighlightCallCount()
```

Used to verify **debounce behavior** during rapid typing.

---

# Docker Deployment Architecture

```mermaid
flowchart TB
    A[Docker Compose] --> B[Build Docker Image]

    B --> C[Start Application Container]

    C --> D[Node Development Server]

    D --> E[Frontend Application]

    E --> F[Accessible via Browser]

    F --> G[http://localhost:3000]
```

---

# Running the Application

### Clone Repository

```
git clone <repository-url>
cd browser-code-editor
```

### Start Docker Containers

```
docker-compose up --build
```

### Open in Browser

```
http://localhost:3000
```

---

# Environment Configuration

Example `.env.example`

```
APP_PORT=3000
NODE_ENV=development
```

This file documents required environment variables for the application.

---

# Accessibility (A11Y)

The editor includes accessibility support using ARIA attributes.

```
role="textbox"
aria-multiline="true"
```

This improves usability for:

- Screen readers
- Keyboard navigation
- Assistive technologies

---

# Technologies Used

- JavaScript
- React / Vanilla JavaScript
- HTML5
- CSS
- Docker
- Docker Compose

---

# Learning Outcomes

This project demonstrates implementation of:

- Advanced browser keyboard event handling
- Event-driven application architecture
- Undo / Redo history management
- Cross-platform keyboard shortcuts
- Multi-step chord command processing
- Debouncing for performance optimization
- Containerized frontend deployment

---

# Future Enhancements

Potential improvements include:

- Syntax highlighting engine
- Large file virtualization
- Real-time collaborative editing
- Plugin architecture
- Theme customization
- File system integration

---

# Conclusion

This project demonstrates how modern web applications handle **complex keyboard interactions**, **state management**, and **performance optimization**.

By combining event-driven design, state history management, and containerized deployment, the editor provides a scalable foundation for building **IDE-like browser applications and collaborative productivity tools**.

