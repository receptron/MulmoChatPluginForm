/**
 * MulmoChat Plugin Vue Types
 *
 * Vue-specific types that extend the core plugin interface.
 */

import type { Component } from "vue";
import type { ToolPluginCore } from "../core/types";

// ============================================================================
// Vue Component Types
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type VueComponent = Component<any>;

/**
 * Legacy Vue component-based config
 * @deprecated Use PluginConfigSchema instead
 */
export interface ToolPluginConfig {
  key: string;
  defaultValue: unknown;
  component: VueComponent;
}

/**
 * Vue plugin interface - extends core with Vue components
 */
export interface ToolPlugin<
  T = unknown,
  J = unknown,
  A extends object = object,
> extends ToolPluginCore<T, J, A> {
  /** Vue component for full view */
  viewComponent?: VueComponent;
  /** Vue component for preview/thumbnail */
  previewComponent?: VueComponent;
  /**
   * Legacy Vue component-based config (for backward compatibility)
   * @deprecated Use configSchema instead
   */
  config?: ToolPluginConfig;
}

// Re-export core types for convenience
export type {
  BackendType,
  ToolContextApp,
  ToolContext,
  ToolResult,
  ToolResultComplete,
  JsonSchemaProperty,
  ToolDefinition,
  StartApiResponse,
  ToolSample,
  InputHandler,
  FileInputHandler,
  ClipboardImageInputHandler,
  UrlInputHandler,
  TextInputHandler,
  FileUploadConfig,
  ConfigValue,
  ConfigFieldSchema,
  PluginConfigSchema,
  ViewComponentProps,
  PreviewComponentProps,
  ToolPluginCore,
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
