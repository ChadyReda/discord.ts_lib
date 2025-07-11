import SuperClient from "@/super_classes/SuperClient.js"
import command_handler from "@/handlers/command_handler.js"
import event_handler from "@/handlers/event_handler.js"
import super_events_handler from "@/handlers/super_events_handler.js"
import context_handler from "@/handlers/context_handler.js"
import component_handler from "./component_handle.js"
import middlewares_handler from "./middlewares_handler.js"
import deploy_commands from "./deploy_commands.js"

export default async function (client: SuperClient) {
    try {
        const token = client.client_config.token
        if (!token) throw new Error('Be sure to provide a token through the config file')
    
        if (client.client_config.location?.base) {
            if (client.client_config.location?.commands) await command_handler(client)
            if (client.client_config.location?.events) await event_handler(client)
            if (client.client_config.location?.context_menus) await context_handler(client)
            if (client.client_config.location?.components) await component_handler(client)
            if (client.client_config.location?.middlewares) await middlewares_handler(client)
            if (client.client_config.location?.slash_commands) await command_handler(client)
            if (client.client_config.location?.database) await command_handler(client)
        }
        await super_events_handler(client)
        await deploy_commands(client)
        await client.login(token)
    } catch (err: any) {
        console.log(err.message)
        throw new Error(`Unable to start the bot, ${err.message}`);
    }
}