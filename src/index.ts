/**
 * MulmoChat Plugin
 *
 * See package.json for plugin details.
 */

import "./style.css";

import { plugin } from "./plugin";
import type { ToolPlugin } from "./common";

export default { plugin: plugin as ToolPlugin };
