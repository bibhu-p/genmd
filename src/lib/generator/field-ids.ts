/**
 * Shared id conventions so components and the controller agree on how to
 * find a field's control, hint and error message. Field names may contain
 * dots (for example `permissions.git`), which are not convenient in ids.
 */

export function fieldId(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export function hintIdFor(name: string): string {
  return `${fieldId(name)}-hint`;
}

export function errorIdFor(name: string): string {
  return `${fieldId(name)}-error`;
}
