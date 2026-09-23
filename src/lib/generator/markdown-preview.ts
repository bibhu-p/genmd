import MarkdownIt from 'markdown-it';

/**
 * Renders Markdown for the preview pane. Raw HTML in the source is escaped
 * (`html: false`) and markdown-it rejects unsafe link schemes such as
 * `javascript:`, so the output is safe to insert into the page. Images are
 * disabled so the preview never makes network requests.
 *
 * Loaded on demand, so the parser is only downloaded when the preview is opened.
 */
const parser = new MarkdownIt({ html: false, linkify: false, typographer: false }).disable('image');

export function renderMarkdown(source: string): string {
  return parser.render(source);
}
