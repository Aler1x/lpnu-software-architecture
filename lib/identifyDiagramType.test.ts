import { getDiagramType } from './identifyDiagramType';

describe('getDiagramType Function', () => {
  it('returns the correct diagram type from valid Mermaid code', () => {
    const mermaidCode = 'graph TD\nA-->B';
    const result = getDiagramType(mermaidCode);
    expect(result).toBe('graph');
  });

  it('returns an empty string for invalid Mermaid code', () => {
    const invalidCode = '\n\n  ';
    const result = getDiagramType(invalidCode);
    expect(result).toBe('');
  });

  it('handles leading and trailing spaces in Mermaid code', () => {
    const mermaidCode = '   sequenceDiagram\nA->>B: Message   ';
    const result = getDiagramType(mermaidCode);
    expect(result).toBe('sequenceDiagram');
  });

  it('handles single-line Mermaid code correctly', () => {
    const mermaidCode = 'pie title Pets\n"Dogs" : 386\n"Cats" : 220';
    const result = getDiagramType(mermaidCode);
    expect(result).toBe('pie');
  });
});
