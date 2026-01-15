/**
 * MulmoChat Form Plugin
 *
 * @example
 * ```typescript
 * import FormPlugin from "@mulmochat-plugin/form";
 * import "@mulmochat-plugin/form/style.css";
 * ```
 */

import "./style.css";

import { plugin } from "./plugin";
import type { ToolPlugin } from "./common";

export default { plugin: plugin as ToolPlugin };
