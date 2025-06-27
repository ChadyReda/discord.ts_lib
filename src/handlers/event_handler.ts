import SuperClient from "../super_classes/SuperClient";
import {readdirSync} from 'fs'
import { SuperEvent} from "../super_classes/SuperEvent";
import { MiddlewareType } from "../interfaces/IMiddleware";

export default async function (client: SuperClient) {
    for (const dir of readdirSync(`./src/logic/events`)) {
        for (const file of readdirSync(`./src/logic/events/${dir}`).filter(f => f.endsWith('.ts'))) {
            const module = await import (`../logic/events/${dir}/${file}`) 
            if (!module) continue;
            const event = module.default;
            if (!(event instanceof SuperEvent)) continue;
            console.log(`Loaded event: ${event.settings.event}`)
            if (event.settings.once) {
                client.once(event.settings.event, (...args: any[]) => event.settings.run(client, ...args))
            }else {
                client.on(event.settings.event, (...args: any[]) => event.settings.run(client, ...args))
            }
        }
    }
}