import SuperClient from "@/super_classes/SuperClient.js";
import { readdirSync, statSync } from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { SuperEvent } from "@/super_classes/SuperEvent.js";

export default async function (client: SuperClient) {
    const eventsBasePath = client.client_config.location?.events;
    if (!eventsBasePath) throw new Error('Be sure to provide the events path in client_config.location.events');

    for (const dir of readdirSync(eventsBasePath)) {
        const dirPath = path.join(eventsBasePath, dir);
        console.log(dirPath);
        if (!statSync(dirPath).isDirectory()) continue;

        for (const file of readdirSync(dirPath).filter(f => f.endsWith('.js'))) {
            const filePath = path.join(dirPath, file);
            try {
                console.log(filePath);
                const module = await import(pathToFileURL(filePath).href);
                if (!module) continue;

                const event = module.default;
                if (!(event instanceof SuperEvent)) continue;

                console.log(`Loaded event: ${event.settings.event}`);

                if (event.settings.once) {
                    client.once(event.settings.event, (...args) => event.settings.run(client, ...args));
                } else {
                    client.on(event.settings.event, (...args) => event.settings.run(client, ...args));
                }
            } catch (e) {
                console.error(`Failed to load event at ${filePath}`, e);
            }
        }
    }
}
