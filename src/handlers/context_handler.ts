import { readdirSync } from "fs";
import SuperClient from "../super_classes/SuperClient";
import SuperContext from "../super_classes/SuperContext";


export default async function (client: SuperClient) {
    for (const type of readdirSync('./src/logic/contexts')) {
        for (const file of readdirSync(`./src/logic/contexts/${type}`).filter(f => f.endsWith('.ts'))) {
            const module = await import (`../logic/contexts/${type}/${file}`)
            if (!module) return;
            const context = module.default;
            if (!(context instanceof SuperContext)) continue;
            if (type == 'message') {
                console.log(`Loaded context: ${context.settings.command.name}`);
                context.settings.command.setType(3);
                client.commandsToRegister.push(context.settings.command)
                client.registry.registerMessageContext(context.settings.command.name, context)
            } else if (type == 'user') {
                console.log(`Loaded context: ${context.settings.command.name}`);
                context.settings.command.setType(2);
                client.commandsToRegister.push(context.settings.command)
                client.registry.registerUserContext(context.settings.command.name, context)
            }
        }
    }
}