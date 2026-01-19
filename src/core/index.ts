/**
 * MulmoChat Form Plugin - Core (Framework-agnostic)
 *
 * This module exports the core plugin logic without UI components.
 * Import from "@mulmochat-plugin/form" or "@mulmochat-plugin/form/core"
 */

// Form-specific types
export type {
  FieldType,
  BaseField,
  TextField,
  TextareaField,
  RadioField,
  DropdownField,
  CheckboxField,
  DateField,
  TimeField,
  NumberField,
  FormField,
  FormData,
  FormArgs,
} from "./types";

// Core plugin utilities
export {
  TOOL_NAME,
  TOOL_DEFINITION,
  SAMPLES,
  executeForm,
  pluginCore,
} from "./plugin";
