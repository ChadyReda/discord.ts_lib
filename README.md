[⚠️ Suspicious Content] # 🤖 Distone.ts 

[![npm version](https://img.shields.io/npm/v/distone.ts)](https://www.npmjs.com/package/distone.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/discord/1031138538051358781?label=Discord&logo=discord)](https://discord.gg/your-invite-link)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

A powerful TypeScript wrapper for Discord.js that simplifies bot development with complete type-safety and intuitive APIs.

# 🧠 SuperDiscord Framework

A scalable, fully customizable TypeScript-based framework for building modular, modern Discord bots using `discord.js`.

---

## 🚀 Features

- Slash Commands, Message Commands, Context Menus, and Components
- Registry system for tracking commands and UI elements
- Built-in Middleware and Cooldown logic
- Developer-only, NSFW, and Permission-based command restrictions
- Centralized bot startup and configuration with `SuperClient`

---

## 📦 Installation

```bash
npm install your-discord-framework-name
```

## 📁 Project Structure example

All the folder paths can be configured through the main.ts file

```bash
src/
├── main.ts                  # Bot entry point
├── commands/                # Message commands (!hello)
│   └── /slash/
│          └── /type/
│                └──sayHi.js
│   └── /message/
│          └── /type/
│                └──help.js
├── events/                  # Discord events (on ready, etc.)
│   └── /type/
│         └──/ready.js
├── components/              # UI components (buttons, modals, selects)
│   └── type/
│        └──/button.js
├── context_menus/           # User/Message context menus
│   └── user/
│        └──/Report.js
│   └── message/
│          └──/delete.js
├── middlewares/             # Global middlewares
│   └── logMiddleware.js
```

## 📚 Core Classes

### 1️⃣SuperClient
Main entry class. Handles config, presence, command loading, and lifecycle.

| Key            | Type           | Description                           |
| -------------- | -------------- | ------------------------------------- |
| token          | `string`       | Required bot token                    |
| prefix         | `string`       | Default prefix (e.g., `!`)            |
| developers     | `string[]`     | Array of developer user IDs           |
| guild\_id      | `string`       | Dev guild for testing commands        |
| client\_id     | `string`       | Discord Application Client ID         |
| dev\_mode      | `boolean`      | Whether to register commands locally  |
| activity\_name | `string`       | Bot status text                       |
| activity\_type | `ActivityType` | Playing / Streaming / Watching / etc. |

### Example
---

```javascript
import { SuperClient } from "distone.ts"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new SuperClient({
    token: "YOUR_BOT_TOKEN",
    guild_id: "YOUR_GUILD_ID",
    prefix: ".c"
    client_id: "YOUR_CLIENT_ID",
    location: {
        base: __dirname,
        commands: 'commands',
        events: 'events',
    },
})

client.start()

```
### 2️⃣SuperSlashCommand

inside your commands/slash/[type]/sayHi.ts

```javascript
import { SuperSlashCommand } from "distone.ts";
import { SlashCommandBuilder } from "discord.js";

export default new SuperSlashCommand({
    command: new SlashCommandBuilder()
        .setName('hi')
        .setDescription('say hi to everyone'),
    cooldown: 5000,                             # 5 seconds
    run: async (client, interaction) => {
        await interaction.reply('hi everyone')
    }
})
```

### 3️⃣️SuperMessageCommand

inside your commands/message/[type]/help.js

``` javascript 
import { SuperMessageCommand } from 'distone.js';

export default new SuperMessageCommand({
  name: 'hello',
  aliases: ['hi', 'yo'],
  run: async (message) => {
    await message.reply('Hello there!');
  },
});

```

### 4️⃣SuperEvent

inside your events/[type]/ready.js
```javascript
import { SuperEvent } from "discord.ts";

export default new SuperEvent({
    event: 'ready',
    once: false,
    run: (client) => {
        console.log('logged in as', client.user.username)
    }    
})
```

## Advanced Features

+ ✅ Context Menu Commands (message, user)

+ ✅ Command Cooldowns

+ ✅ NSFW Checks

+ ✅ Permission Error Handlers

+ ✅ Aliases for Message Commands

+ ✅ Middleware Chaining

+ ✅ Component Registry (Buttons, Modals, Selects)

+ ✅ Centralized Error Handling

## 🧠 Dev Mode
Set `dev_mode`: `true` to register slash commands instantly to your guild_id. Use false for global deployment (can take up to 1 hour).

## 📄 License
MIT — Free to use, modify, or build on top of.

## 📬 Contact
Found a bug? Need help? Open an issue or DM on Discord.