import { MermaidThemes } from './types'

export const presets = [
  "Simple Flowchart",
  "Sequence Diagram",
  "Gantt Chart",
]

export const presetDiagrams: Record<string, string> = {
  "Simple Flowchart": `graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]`,
  "Sequence Diagram": `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`,
  "Gantt Chart": `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2014-01-12, 12d
    another task     :24d`
}

export const themes: MermaidThemes[] = ['default', 'forest', 'dark', 'neutral']

export const preprompts = [
  "Create a flowchart for a simple web application",
  "Design a sequence diagram for user authentication",
  "Generate a gantt chart for a software development project",
]