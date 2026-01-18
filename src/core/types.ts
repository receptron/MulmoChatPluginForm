/**
 * MulmoChat Plugin Core Types (Framework-agnostic)
 *
 * These types can be used by any framework implementation (Vue, React, etc.)
 */

// ============================================================================
// Core Types
// ============================================================================

/**
 * Backend types that plugins can declare they use.
 * App layer manages actual provider/model settings for each type.
 */
export type BackendType =
  | "textLLM"
  | "imageGen"
  | "audio"
  | "search"
  | "browse"
  | "map"
  | "mulmocast";

/**
 * App interface provided to plugins via context.app
 * Contains backend functions and config accessors
 */
export interface ToolContextApp
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends Record<string, (...args: any[]) => any> {
  getConfig: <T = unknown>(key: string) => T | undefined;
  setConfig: (key: string, value: unknown) => void;
}

/**
 * Context passed to plugin execute function
 */
export interface ToolContext {
  currentResult?: ToolResult<unknown> | null;
  app?: ToolContextApp;
}

/**
 * Result returned from plugin execution
 */
export interface ToolResult<T = unknown, J = unknown> {
  toolName?: string;
  uuid?: string;
  message: string;
  title?: string;
  jsonData?: J;
  instructions?: string;
  instructionsRequired?: boolean;
  updating?: boolean;
  cancelled?: boolean;
  data?: T;
  viewState?: Record<string, unknown>;
}

/**
 * Complete tool result with required fields
 */
export interface ToolResultComplete<T = unknown, J = unknown>
  extends ToolResult<T, J> {
  toolName: string;
  uuid: string;
}

/**
 * JSON Schema property definition for tool parameters
 */
export interface JsonSchemaProperty {
  type?: string;
  description?: string;
  enum?: string[];
  items?: JsonSchemaProperty;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  additionalProperties?: boolean;
  oneOf?: JsonSchemaProperty[];
  [key: string]: unknown;
}

/**
 * Tool definition for OpenAI-compatible function calling
 */
export interface ToolDefinition {
  type: "function";
  name: string;
  description: string;
  parameters?: {
    type: "object";
    properties: Record<string, JsonSchemaProperty>;
    required: string[];
    additionalProperties?: boolean;
  };
}

/**
 * API response from server start endpoint
 */
export interface StartApiResponse {
  hasOpenAIApiKey?: boolean;
  hasAnthropicApiKey?: boolean;
  hasGoogleApiKey?: boolean;
  [key: string]: unknown;
}

/**
 * Sample arguments for testing
 */
export interface ToolSample {
  name: string;
  args: Record<string, unknown>;
}

// ============================================================================
// Input Handlers (Framework-agnostic)
// ============================================================================

/**
 * File input handler
 */
export interface FileInputHandler {
  type: "file";
  acceptedTypes: string[];
  handleInput: (
    fileData: string,
    fileName: string,
  ) => ToolResult<unknown, unknown>;
}

/**
 * Clipboard image input handler
 */
export interface ClipboardImageInputHandler {
  type: "clipboard-image";
  handleInput: (imageData: string) => ToolResult<unknown, unknown>;
}

/**
 * URL input handler
 */
export interface UrlInputHandler {
  type: "url";
  patterns?: string[];
  handleInput: (url: string) => ToolResult<unknown, unknown>;
}

/**
 * Text input handler
 */
export interface TextInputHandler {
  type: "text";
  patterns?: string[];
  handleInput: (text: string) => ToolResult<unknown, unknown>;
}

/**
 * Union of all input handler types
 */
export type InputHandler =
  | FileInputHandler
  | ClipboardImageInputHandler
  | UrlInputHandler
  | TextInputHandler;

/**
 * Legacy file upload config (for backward compatibility)
 * @deprecated Use InputHandler instead
 */
export interface FileUploadConfig {
  acceptedTypes: string[];
  handleUpload: (
    fileData: string,
    fileName: string,
    ...args: unknown[]
  ) => ToolResult<unknown, unknown>;
}

// ============================================================================
// Plugin Config Schema (JSON Schema based)
// ============================================================================

export type ConfigValue = string | number | boolean | string[];

interface BaseFieldSchema {
  label: string;
  description?: string;
  required?: boolean;
}

export interface StringFieldSchema extends BaseFieldSchema {
  type: "string";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface NumberFieldSchema extends BaseFieldSchema {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface BooleanFieldSchema extends BaseFieldSchema {
  type: "boolean";
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectFieldSchema extends BaseFieldSchema {
  type: "select";
  options: SelectOption[];
}

export interface MultiSelectFieldSchema extends BaseFieldSchema {
  type: "multiselect";
  options: SelectOption[];
  minItems?: number;
  maxItems?: number;
}

export type ConfigFieldSchema =
  | StringFieldSchema
  | NumberFieldSchema
  | BooleanFieldSchema
  | SelectFieldSchema
  | MultiSelectFieldSchema;

/**
 * Plugin configuration schema (JSON Schema based)
 */
export interface PluginConfigSchema {
  key: string;
  defaultValue: ConfigValue;
  schema: ConfigFieldSchema;
}

// ============================================================================
// View Component Props (Framework-agnostic interface definitions)
// ============================================================================

/**
 * Standard props for View components
 */
export interface ViewComponentProps<T = unknown, J = unknown> {
  selectedResult: ToolResultComplete<T, J>;
  sendTextMessage: (text?: string) => void;
  onUpdateResult?: (result: Partial<ToolResult<T, J>>) => void;
  pluginConfigs?: Record<string, unknown>;
}

/**
 * Standard props for Preview components
 */
export interface PreviewComponentProps<T = unknown, J = unknown> {
  result: ToolResultComplete<T, J>;
  isSelected?: boolean;
  onSelect?: () => void;
}

// ============================================================================
// Core Plugin Interface (Framework-agnostic)
// ============================================================================

/**
 * Core plugin interface - framework agnostic
 * Does not include UI components
 */
export interface ToolPluginCore<
  T = unknown,
  J = unknown,
  A extends object = object,
> {
  toolDefinition: ToolDefinition;
  execute: (context: ToolContext, args: A) => Promise<ToolResult<T, J>>;
  generatingMessage: string;
  waitingMessage?: string;
  uploadMessage?: string;
  isEnabled: (startResponse?: StartApiResponse | null) => boolean;
  delayAfterExecution?: number;
  systemPrompt?: string;
  inputHandlers?: InputHandler[];
  /** @deprecated Use inputHandlers instead */
  fileUpload?: FileUploadConfig;
  /** New JSON Schema based config (framework-agnostic) */
  configSchema?: PluginConfigSchema;
  samples?: ToolSample[];
  backends?: BackendType[];
}

// ============================================================================
// Form-specific Types
// ============================================================================

/** Field type discriminator */
export type FieldType =
  | "text"
  | "textarea"
  | "radio"
  | "dropdown"
  | "checkbox"
  | "date"
  | "time"
  | "number";

/** Base field interface */
export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required?: boolean;
  maxLength?: number;
}

/** Text field */
export interface TextField extends BaseField {
  type: "text";
  placeholder?: string;
  validation?: "email" | "url" | "phone" | string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
}

/** Textarea field */
export interface TextareaField extends BaseField {
  type: "textarea";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  defaultValue?: string;
}

/** Radio field */
export interface RadioField extends BaseField {
  type: "radio";
  choices: string[];
  defaultValue?: string;
}

/** Dropdown field */
export interface DropdownField extends BaseField {
  type: "dropdown";
  choices: string[];
  searchable?: boolean;
  defaultValue?: string;
}

/** Checkbox field */
export interface CheckboxField extends BaseField {
  type: "checkbox";
  choices: string[];
  minSelections?: number;
  maxSelections?: number;
  defaultValue?: string[];
}

/** Date field */
export interface DateField extends BaseField {
  type: "date";
  minDate?: string;
  maxDate?: string;
  format?: string;
  defaultValue?: string;
}

/** Time field */
export interface TimeField extends BaseField {
  type: "time";
  format?: "12hr" | "24hr";
  defaultValue?: string;
}

/** Number field */
export interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}

/** Union type for all fields */
export type FormField =
  | TextField
  | TextareaField
  | RadioField
  | DropdownField
  | CheckboxField
  | DateField
  | TimeField
  | NumberField;

/** Form data stored in result.jsonData */
export interface FormData {
  title?: string;
  description?: string;
  fields: FormField[];
}

/** Arguments passed to the form tool */
export interface FormArgs {
  title?: string;
  description?: string;
  fields: FormField[];
}
