/**
 * Re-export common types for backward compatibility.
 * New plugins should import from "./common" directly.
 */
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
