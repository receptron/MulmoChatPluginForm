# @mulmochat-plugin/form

[![npm version](https://badge.fury.io/js/%40mulmochat-plugin%2Fform.svg)](https://www.npmjs.com/package/@mulmochat-plugin/form)

A plugin for [MulmoChat](https://github.com/receptron/MulmoChat) - a multi-modal voice chat application with OpenAI's GPT-4 Realtime API.

## What this plugin does

Creates structured forms to collect user information with various field types.

## Installation

```bash
yarn add @mulmochat-plugin/form
```

## Usage

```typescript
import Plugin from "@mulmochat-plugin/form";
import "@mulmochat-plugin/form/style.css";

// Add to pluginList
const pluginList = [
  // ... other plugins
  Plugin,
];
```

## Development

```bash
# Install dependencies
yarn install

# Start dev server (http://localhost:5173/)
yarn dev

# Build
yarn build

# Type check
yarn typecheck

# Lint
yarn lint
```

## Test Prompts

Try these prompts to test the plugin:

1. "Create a contact form with name, email, and message fields"
2. "Make a survey form about user preferences"
3. "Generate a registration form with username and password"

## License

MIT
