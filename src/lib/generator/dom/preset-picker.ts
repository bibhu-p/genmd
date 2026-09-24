import { findPreset } from '../../../data/presets';
import type { FormState } from '../../../types/generator';
import { applyPreset, resetPresetFields, wouldOverwriteChoices } from '../presets';
import { fillPresetFields } from './fill-form';

type Tone = 'success' | 'error';

/** Query parameter that applies a preset on load, for example `/generator/?preset=rust-cli`. */
const PRESET_PARAM = 'preset';

/**
 * Wires up the "Start from a preset" picker on step 1, and applies a preset
 * named in the page URL. Applying never touches project basics or permissions,
 * and asks first before replacing choices the user made in later steps.
 */
export function setupPresetPicker(form: HTMLFormElement, readState: () => FormState): void {
  const picker = form.querySelector<HTMLElement>('[data-preset-picker]');
  const select = picker?.querySelector<HTMLSelectElement>('[data-preset-select]');
  const applyButton = picker?.querySelector<HTMLButtonElement>('[data-preset-apply]');
  const status = picker?.querySelector<HTMLElement>('[data-preset-status]');
  if (!select || !applyButton || !status) return;

  /** The form state right after the last preset was applied, as read back from the form. */
  let lastApplied: FormState | undefined;

  function announce(message: string, tone: Tone = 'success'): void {
    status!.textContent = message;
    status!.dataset.tone = tone;
  }

  function fill(next: FormState): void {
    fillPresetFields(form, next);
    lastApplied = readState();
  }

  function apply(): void {
    const id = select!.value;
    const preset = id ? findPreset(id) : undefined;
    const state = readState();
    if (
      wouldOverwriteChoices(state, lastApplied) &&
      !window.confirm('This replaces the stack, preferences and checks you have chosen in steps 2 to 5. Continue?')
    ) {
      return;
    }

    if (preset) {
      fill(applyPreset(state, preset));
      announce(`Applied ${preset.label}. Steps 2 to 5 are filled in; review them as you go.`);
    } else {
      fill(resetPresetFields(state));
      announce('Cleared the preset. Steps 2 to 5 are back to their defaults.');
    }
  }

  applyButton.addEventListener('click', apply);

  const requested = new URLSearchParams(window.location.search).get(PRESET_PARAM);
  if (requested) {
    const preset = findPreset(requested);
    if (preset) {
      select.value = preset.id;
      fill(applyPreset(readState(), preset));
      announce(`Applied ${preset.label} from the link. Steps 2 to 5 are filled in; review them as you go.`);
    } else {
      announce('The preset in this link was not recognised, so the form starts blank.', 'error');
    }
  }
}
