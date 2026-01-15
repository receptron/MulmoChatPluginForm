/**
 * MulmoChat Plugin Common Types
 *
 * Core interfaces for building MulmoChat plugins.
 * These types are plugin-agnostic and can be used by any plugin implementation.
 */

import type { Component } from "vue";

/**
 * Context passed to plugin execute function
 */
export interface ToolContext {
  currentResult?: ToolResult<unknown> | null;
  userPreferences?: Record<string, unknown>;
  getPluginConfig?: <T = unknown>(key: string) => T | undefined;
  /** Backend API functions provided by the host app */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app?: Record<string, (...args: any[]) => any>;
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
 * API response from server start endpoint
 */
export interface StartApiResponse {
  hasOpenAIApiKey?: boolean;
  hasAnthropicApiKey?: boolean;
  hasGoogleApiKey?: boolean;
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
 * File upload configuration
 */
export interface FileUploadConfig {
  acceptedTypes: string[];
  handleUpload: (
    fileData: string,
    fileName: string,
    ...args: unknown[]
  ) => ToolResult<unknown, unknown>;
}

/**
 * Plugin configuration
 */
export interface ToolPluginConfig {
  key: string;
  defaultValue: unknown;
  component: Component;
}

/**
 * Sample arguments for testing
 */
export interface ToolSample {
  name: string;
  args: Record<string, unknown>;
}

/**
 * Main plugin interface
 * @template T - Type of data stored in result.data
 * @template J - Type of data stored in result.jsonData
 * @template A - Type of arguments passed to execute
 */
export interface ToolPlugin<
  T = unknown,
  J = unknown,
  A extends object = object,
> {
  /** Tool definition for LLM function calling */
  toolDefinition: ToolDefinition;

  /** Execute the plugin with given context and arguments */
  execute: (context: ToolContext, args: A) => Promise<ToolResult<T, J>>;

  /** Message shown while generating */
  generatingMessage: string;

  /** Message shown while waiting for user action */
  waitingMessage?: string;

  /** Message shown during file upload */
  uploadMessage?: string;

  /** Check if plugin is enabled based on server capabilities */
  isEnabled: (startResponse?: StartApiResponse | null) => boolean;

  /** Delay in ms after execution before proceeding */
  delayAfterExecution?: number;

  /** Vue component for full view */
  viewComponent?: Component;

  /** Vue component for preview/thumbnail */
  previewComponent?: Component;

  /** System prompt additions for this plugin */
  systemPrompt?: string;

  /** Optional file upload configuration */
  fileUpload?: FileUploadConfig;

  /** Optional plugin-specific configuration */
  config?: ToolPluginConfig;

  /** Optional sample arguments for testing */
  samples?: ToolSample[];
}
