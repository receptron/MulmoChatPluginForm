/**
 * MulmoChat Form Plugin
 *
 * A plugin for creating structured forms to collect user information.
 *
 * @packageDocumentation
 *
 * @example Basic usage
 * ```typescript
 * import { plugin } from "@mulmochat-plugin/form";
 * import "@mulmochat-plugin/form/style.css";
 *
 * // Plugin is ready to use
 * const tools = [plugin.toolDefinition];
 * ```
 *
 * @example Using Vue components directly
 * ```typescript
 * import { FormView, FormPreview } from "@mulmochat-plugin/form";
 * ```
 */

// ============================================================================
// Styles
// ============================================================================

import "./style.css";

// ============================================================================
// Common Types (plugin-agnostic)
// ============================================================================

export type {
  ToolContext,
  ToolResult,
  ToolPlugin,
  ToolDefinition,
  JsonSchemaProperty,
  StartApiResponse,
  FileUploadConfig,
  ToolPluginConfig,
  ToolSample,
} from "./common";

// ============================================================================
// Form-specific Types
// ============================================================================

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
  FormResult,
} from "./plugin";

// ============================================================================
// Plugin Instance
// ============================================================================

export { plugin } from "./plugin";

// Default export for convenience
export { plugin as default } from "./plugin";

// ============================================================================
// Plugin Module (for MulmoChat integration)
// ============================================================================

import { plugin } from "./plugin";

/**
 * FormPlugin module matching MulmoChat's expected plugin structure.
 * Use this for direct import: `import { FormPlugin } from "@mulmochat-plugin/form"`
 */
export const FormPlugin = { plugin };

// ============================================================================
// Vue Components
// ============================================================================

export { default as FormView } from "./views/FormView.vue";
export { default as FormPreview } from "./previews/FormPreview.vue";
