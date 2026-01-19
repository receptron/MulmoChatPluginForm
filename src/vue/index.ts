/**
 * MulmoChat Form Plugin - Vue Implementation
 *
 * Full Vue plugin with UI components.
 * Import from "@mulmochat-plugin/form/vue"
 */

// Import styles for Vue components
import "../style.css";

import type { ToolPlugin } from "gui-chat-protocol/vue";
import type { FormData, FormArgs } from "../core/types";
import { pluginCore } from "../core/plugin";
import View from "./View.vue";
import Preview from "./Preview.vue";

// ============================================================================
// Vue Plugin (with components)
// ============================================================================

/**
 * Form plugin instance with Vue components
 */
export const plugin: ToolPlugin<never, FormData, FormArgs> = {
  ...pluginCore,
  viewComponent: View,
  previewComponent: Preview,
};

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
} from "../core/types";

// Core plugin utilities
export {
  TOOL_NAME,
  TOOL_DEFINITION,
  SAMPLES,
  executeForm,
  pluginCore,
} from "../core/plugin";

// Export components for direct use
export { View, Preview };

// Default export for MulmoChat compatibility: { plugin }
export default { plugin };
