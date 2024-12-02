export function getDiagramType(mermaidCode: string): string {
  // Trim any leading/trailing whitespace from the Mermaid code
  const trimmedCode = mermaidCode.trim();

  // Extract the first line of the Mermaid code
  const firstLine = trimmedCode.split('\n')[0].trim();

  // Match the diagram type using a regular expression
  const match = firstLine.match(/^\w+/);

  // If a match is found, return the diagram type; otherwise, return empty string
  return match ? match[0] : '';
}
