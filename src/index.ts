/**
 * MulmoChat Form Plugin
 *
 * Default export is the framework-agnostic core.
 * For Vue implementation, import from "@mulmochat-plugin/form/vue"
 *
 * @example Default (Core - framework-agnostic)
 * ```typescript
 * import { pluginCore, TOOL_NAME, FormData } from "@mulmochat-plugin/form";
 * ```
 *
 * @example Vue implementation
 * ```typescript
 * import FormPlugin from "@mulmochat-plugin/form/vue";
 * import "@mulmochat-plugin/form/style.css";
 * ```
 */

// Default export is core (framework-agnostic)
export * from "./core";
export { pluginCore as default } from "./core";
