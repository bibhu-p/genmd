import { STEPS } from '../../data/steps';
import { setupConditionalFields } from './dom/conditional';
import { clearFieldError, clearStepErrors, showStepErrors } from './dom/errors';
import { setupOutput } from './dom/output';
import { setupPresetPicker } from './dom/preset-picker';
import { renderSummary } from './dom/summary-view';
import { formStateFromData } from './form-data';
import { generateClaudeMd } from './generate';
import { normalize } from './normalize';
import { checkSettingsJson, generateSettingsJson } from './settings';
import { summarize } from './summary';
import { validateStep } from './validation';

const REVIEW_INDEX = STEPS.length - 1;

/**
 * Wires up the multi-step questionnaire. All steps stay in the DOM and are
 * shown or hidden, so input is preserved when moving between them.
 */
export function initGenerator(form: HTMLFormElement): void {
  const panels: HTMLElement[] = [];
  for (const step of STEPS) {
    const panel = form.querySelector<HTMLElement>(`[data-step="${step.id}"]`);
    if (!panel) return;
    panels.push(panel);
  }

  const backButton = form.querySelector<HTMLButtonElement>('[data-action="back"]');
  const nextButton = form.querySelector<HTMLButtonElement>('[data-action="next"]');
  const resumeButton = form.querySelector<HTMLButtonElement>('[data-action="resume"]');
  const nextLabel = form.querySelector<HTMLElement>('[data-next-label]');
  const resumeLabel = form.querySelector<HTMLElement>('[data-resume-label]');
  const progressItems = Array.from(form.querySelectorAll<HTMLButtonElement>('[data-progress-item]'));
  const progressStatus = form.querySelector<HTMLElement>('[data-progress-status]');
  const summaryContainer = form.querySelector<HTMLElement>('[data-review-summary]');
  const claudeMdRoot = form.querySelector<HTMLElement>('[data-output="claude-md"]');
  const settingsRoot = form.querySelector<HTMLElement>('[data-output="settings"]');

  let current = 0;
  let furthest = 0;

  const readState = () => formStateFromData(new FormData(form));
  const readConfig = () => normalize(readState());
  const claudeMd = claudeMdRoot
    ? setupOutput(claudeMdRoot, {
        filename: 'CLAUDE.md',
        mimeType: 'text/markdown;charset=utf-8',
        generate: () => generateClaudeMd(readConfig()),
      })
    : null;
  const settings = settingsRoot
    ? setupOutput(settingsRoot, {
        filename: 'settings.json',
        mimeType: 'application/json;charset=utf-8',
        generate: () => generateSettingsJson(readConfig()),
        check: checkSettingsJson,
      })
    : null;

  function render(): void {
    panels.forEach((panel, index) => {
      panel.hidden = index !== current;
    });

    progressItems.forEach((item, index) => {
      const isComplete = index < furthest && index !== current;
      item.disabled = index > furthest;
      item.toggleAttribute('data-complete', isComplete);
      if (index === current) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      const state = item.querySelector('[data-progress-state]');
      if (state) state.textContent = isComplete ? ' (completed)' : '';
    });

    if (progressStatus) {
      progressStatus.textContent = `Step ${current + 1} of ${STEPS.length} · ${STEPS[current].title}`;
    }
    if (backButton) backButton.hidden = current === 0;
    if (nextButton) nextButton.hidden = current === REVIEW_INDEX;
    if (nextLabel) nextLabel.textContent = current === REVIEW_INDEX - 1 ? 'Review and generate' : 'Next';

    // Offer a shortcut back to where the user was before stepping back to edit.
    if (resumeButton) resumeButton.hidden = furthest <= current + 1;
    if (resumeLabel) {
      resumeLabel.textContent = furthest === REVIEW_INDEX ? 'Return to review' : `Return to step ${furthest + 1}`;
    }

    if (current === REVIEW_INDEX) {
      if (summaryContainer) renderSummary(summaryContainer, summarize(readState()));
      claudeMd?.sync();
      settings?.sync();
    }
  }

  function goTo(index: number): void {
    clearStepErrors(panels[current]);
    current = index;
    furthest = Math.max(furthest, index);
    render();

    if (form.getBoundingClientRect().top < 0) form.scrollIntoView({ block: 'start' });
    panels[current].querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true });
  }

  function next(): void {
    const errors = validateStep(STEPS[current].id, readState());
    if (errors.length > 0) {
      showStepErrors(form, panels[current], errors);
      return;
    }
    if (current < REVIEW_INDEX) goTo(current + 1);
  }

  /** Jumps to a visited step. Moving forward re-validates the steps in between. */
  function jumpTo(index: number): void {
    if (index > furthest) return;
    const state = readState();
    for (let step = current; step < index; step++) {
      const errors = validateStep(STEPS[step].id, state);
      if (errors.length > 0) {
        if (step !== current) goTo(step);
        showStepErrors(form, panels[step], errors);
        return;
      }
    }
    if (index !== current) goTo(index);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    next();
  });

  backButton?.addEventListener('click', () => {
    if (current > 0) goTo(current - 1);
  });

  resumeButton?.addEventListener('click', () => jumpTo(furthest));

  form.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-step-target]') : null;
    if (!trigger) return;
    const index = STEPS.findIndex((step) => step.id === trigger.dataset.stepTarget);
    if (index >= 0) jumpTo(index);
  });

  const onEdit = (event: Event) => {
    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    ) {
      if (!target.name) return;
      clearFieldError(form, target.name);
      if (target instanceof HTMLSelectElement) clearFieldError(form, `${target.name}Other`);
      if (target.name === 'customInstructions') claudeMd?.sync();
    }
  };
  form.addEventListener('input', onEdit);
  form.addEventListener('change', onEdit);

  setupConditionalFields(form);
  // After the conditional fields, so a preset from the URL updates the filtered options.
  setupPresetPicker(form, readState);
  render();
}
