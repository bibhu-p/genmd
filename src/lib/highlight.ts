/**
 * A tiny line-based Markdown highlighter for the static example on the
 * landing page. Produces plain data that templates render as text, so no
 * HTML is ever built from strings.
 */

export type LineKind = 'h1' | 'h2' | 'h3' | 'quote' | 'text';
export type SegmentKind = 'plain' | 'marker' | 'strong' | 'code';

export interface Segment {
  kind: SegmentKind;
  text: string;
}

export interface HighlightedLine {
  kind: LineKind;
  segments: Segment[];
}

function inlineSegments(text: string): Segment[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/)
    .filter(Boolean)
    .map((part): Segment => {
      if (part.startsWith('**') && part.endsWith('**')) return { kind: 'strong', text: part };
      if (part.startsWith('`') && part.endsWith('`')) return { kind: 'code', text: part };
      return { kind: 'plain', text: part };
    });
}

export function highlightMarkdown(source: string): HighlightedLine[] {
  return source.split('\n').map((line): HighlightedLine => {
    const heading = /^(#{1,3}) /.exec(line);
    if (heading) {
      const kind = heading[1] === '#' ? 'h1' : heading[1] === '##' ? 'h2' : 'h3';
      return { kind, segments: [{ kind: 'plain', text: line }] };
    }
    if (line.startsWith('> ')) return { kind: 'quote', segments: [{ kind: 'plain', text: line }] };

    const marker = /^(\s*(?:[-*]|\d+\.)(?: \[ \])? )/.exec(line);
    if (marker) {
      return {
        kind: 'text',
        segments: [{ kind: 'marker', text: marker[1] }, ...inlineSegments(line.slice(marker[1].length))],
      };
    }
    return { kind: 'text', segments: inlineSegments(line) };
  });
}
