/** Saves text as a file using a temporary object URL. No network request is made. */
export function downloadTextFile(
  filename: string,
  content: string,
  type = 'text/markdown;charset=utf-8',
): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  // Some browsers start the download asynchronously, so release the URL a little later.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
