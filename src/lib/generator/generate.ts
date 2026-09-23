import type { ProjectConfig } from '../../types/generator';
import { joinBlocks } from './markdown';
import {
  architectureSection,
  codingStandardsSection,
  customInstructionsSection,
  definitionOfDoneSection,
  documentationSection,
  overviewSection,
  permissionsSection,
  scopeSection,
  securitySection,
  type SectionGenerator,
  techStackSection,
  testingSection,
  titleSection,
  workflowSection,
} from './sections';

/** Section order in the generated file. */
const SECTIONS: readonly SectionGenerator[] = [
  titleSection,
  overviewSection,
  techStackSection,
  architectureSection,
  workflowSection,
  codingStandardsSection,
  permissionsSection,
  testingSection,
  securitySection,
  documentationSection,
  scopeSection,
  definitionOfDoneSection,
  customInstructionsSection,
];

/** Builds the CLAUDE.md content. Deterministic: the same config always gives the same output. */
export function generateClaudeMd(config: ProjectConfig): string {
  return `${joinBlocks(SECTIONS.map((section) => section(config)))}\n`;
}
