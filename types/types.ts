export type APIErrorResponse = {
  message: string
};

export type Diagram = {
  _id: string
  name: string
  description: string
  mermaid: string
  createdBy: number
  createdAt: string
  updatedAt: string
};

export type DiagramList = Omit<Diagram, 'mermaid' | 'createdBy'>;
