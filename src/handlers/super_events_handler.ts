import SuperClient from "@/super_classes/SuperClient.js";
import { readdirSync, statSync } from "fs";
import {SuperEvent} from "@/super_classes/SuperEvent.js";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (client: SuperClient) {
    const superEventsPath = path.join(__dirname, '../super_events');
    if (statSync(superEventsPath).isDirectory()) {
        for (const file of readdirSync(superEventsPath).filter(f => f.endsWith('.js'))) {
            const filePath = path.join(superEventsPath, file);
            try {
                const module = await import(pathToFileURL(filePath).href);
                if (!module) continue;

                const event = module.default;
                if (!(event instanceof SuperEvent)) continue;

                console.log(`Loaded Super Event: ${event.settings.event}`);
                if (event.settings.once) {
                    client.once(event.settings.event, (...args) => event.settings.run(client, ...args));
                } else {
                    client.on(event.settings.event, (...args) => event.settings.run(client, ...args));
                }
            } catch (err: any) {
                throw new Error(`Error Loading super events <try restarting the bot> ${err.message}`);
            }
        }
    }
};