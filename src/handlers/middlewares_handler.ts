import SuperClient from "../super_classes/SuperClient";
import { readdirSync } from 'fs'
import { SuperMiddleware } from "../super_classes/SuperMiddleware";

export default async function(client: SuperClient) {
    for (const file of readdirSync(`./src/logic/middlewares`).filter(f => f.endsWith('.ts'))) {
        const module = await import (`../logic/middlewares/${file}`)
        if (!module) return
        const middleware = module.default;
        if (!( middleware instanceof SuperMiddleware)) continue;
        client.registry.middlewareRunner.use(middleware) 
        console.log(`Global Middleware *${file.replace('.ts', '')}* is Loaded successfuly`)
    }
}