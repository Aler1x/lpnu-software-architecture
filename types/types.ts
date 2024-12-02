export type APIErrorResponse = {
  message: string
};

export type Diagram = {
  _id: string
  title: string
  type: string
  description: string
  mermaid_code: string
  created_by: string
  created_at: Date
  updated_at: Date
};

export type DiagramList = Omit<Diagram, 'mermaid_code' | 'created_by' | 'created_at'>;

export type MermaidThemes = "default" | "base" | "dark" | "forest" | "neutral" | "null";

export type Message = {
  message: string
  my: boolean
}


