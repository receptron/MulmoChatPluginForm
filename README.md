# MulmoChat Plugin Form

A form plugin for MulmoChat. Creates structured forms to collect user information.

## Overview

This plugin provides dynamic form generation with various field types including text, textarea, radio, dropdown, checkbox, date, time, and number fields.

- **Tailwind CSS 4** for styling
- **TypeScript** for type-safe implementation
- **ESLint** for static analysis

## Installation

### Adding to MulmoChat

1. Install the plugin:
```bash
cd MulmoChat
yarn add @mulmochat-plugin/form
```

2. Import in MulmoChat's `src/tools/index.ts`:
```typescript
import FormPlugin from "@mulmochat-plugin/form";
import "@mulmochat-plugin/form/style.css";

// Add to pluginList
const pluginList = [
  // ... other plugins
  FormPlugin,
];
```

## Development

### Setup

```bash
yarn install
```

### Development Server

```bash
yarn dev
```

Demo page will be available at http://localhost:5173/

### Build

```bash
yarn build
```

### Type Check

```bash
yarn typecheck
```

### Lint

```bash
yarn lint
```

## Plugin Structure

```
MulmoChatPluginForm/
├── src/
│   ├── index.ts          # Export definitions
│   ├── style.css         # Tailwind CSS entry
│   ├── common/           # Plugin-agnostic shared code
│   │   ├── index.ts      # Common exports
│   │   └── types.ts      # ToolPlugin, ToolResult, etc.
│   └── plugin/           # Form-specific implementation
│       ├── index.ts      # Plugin instance and execute logic
│       ├── types.ts      # Form types and TOOL_DEFINITION
│       ├── samples.ts    # Sample data for testing
│       ├── View.vue      # Main view component
│       └── Preview.vue   # Sidebar preview component
├── demo/                 # Generic plugin demo
│   ├── App.vue
│   └── main.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

## License

MIT
