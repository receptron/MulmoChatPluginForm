/**
 * MulmoChat Form Plugin - Core (Framework-agnostic)
 *
 * This module exports the core plugin logic without UI components.
 * Import from "@mulmochat-plugin/form" or "@mulmochat-plugin/form/core"
 */

// Export all types
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
} from "./types";

// Export plugin utilities
export {
  TOOL_NAME,
  TOOL_DEFINITION,
  SAMPLES,
  executeForm,
  pluginCore,
} from "./plugin";
