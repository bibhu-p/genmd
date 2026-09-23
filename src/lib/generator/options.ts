import { NONE_VALUE, OTHER_VALUE } from '../../data/frameworks';
import type { SelectOption } from '../../types/generator';

/** The label of the option with `value`, or undefined if there is none. */
export function labelOf(options: readonly SelectOption[], value: string): string | undefined {
  return options.find((option) => option.value === value)?.label;
}

/**
 * Resolves a select value to the label the generator should use: the user's
 * text for "Other", undefined for "None" or an empty choice.
 */
export function resolveChoice(
  options: readonly SelectOption[],
  value: string,
  otherText: string,
): string | undefined {
  if (value === OTHER_VALUE) return otherText.trim() || undefined;
  if (value === NONE_VALUE) return undefined;
  return labelOf(options, value);
}

/** Like `resolveChoice`, but keeps the label of "None" options for display. */
export function displayChoice(
  options: readonly SelectOption[],
  value: string,
  otherText: string,
): string | undefined {
  return value === NONE_VALUE ? labelOf(options, value) : resolveChoice(options, value, otherText);
}

/** Non-empty, trimmed lines. */
export function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Non-empty, trimmed entries separated by commas or new lines. */
export function splitList(text: string): string[] {
  return text
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}
