import SuperClient from "../super_classes/SuperClient";
import { readdirSync } from 'fs'
import { MiddlewareType } from "../interfaces/IMiddleware";
import { SuperMiddleware } from "../super_classes/SuperMiddleware";

export default async function(client: SuperClient) {
    for (const dir of readdirSync(`./src/logic/middlewares`)) {
        for (const file of readdirSync(`./src/logic/middlewares/${dir}`).filter(f => f.endsWith('.ts'))) {
            const module = await import (`../logic/middlewares/${file}`)
            if (!module) return
            const middleware = module.default;
            if (!( middleware instanceof SuperMiddleware)) continue;
            if (middleware.settings.type == MiddlewareType.GLOBAL) {
                client.registry.global_component_middlwares.push(middleware.settings.run)
            } else if (middleware.settings.type == MiddlewareType.CONTEXT) {
                client.registry.global_context_middlwares.push(middleware.settings.run)
            } else if (middleware.settings.type == MiddlewareType.MESSAGE) {
                client.registry.global_message_middlwares.push(middleware.settings.run)
            } else if (middleware.settings.type == MiddlewareType.SLASH) {
                client.registry.global_slash_middlwares.push(middleware.settings.run)
            } 
            console.log(`Global Middleware *${file.replace('.ts', '')}* is Loaded successfuly`)
        }
    }
}