import { Routes, REST } from "discord.js";
import SuperClient from "@/super_classes/SuperClient.js";

export default async function (client: SuperClient) {
    
    const token = client.client_config.token
    
    if (client.commandsToRegister.length === 0) {
        throw new Error('No commands to register')
    }
        
    if (!token) throw new Error('Be sure to provide a token through the config file')

    const rest = new REST({ version: '10' }).setToken(token)
    console.log(`Started refreshing ${client.commandsToRegister.length} application (/) commands.`)

    const guildId = client.client_config.guild_id
    const useDev = client.client_config.dev_mode
    const clientId = client.client_config.client_id

    if (!guildId || !clientId) {
        throw new Error('Be sure to provide a guild id or client id through the config file')
    }


    if (guildId && useDev) {
        rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: client.commandsToRegister
        }).then(_ => {
            console.log(`Successfully reloaded ${client.commandsToRegister.length} application (/) commands to guild ${guildId}.`)
        }).catch((e: any) => {
            throw new Error(`Unable to reload ${client.commandsToRegister.length} application (/) commands to guild ${guildId}, ${e.message}`)
        })
    } else {
        rest.put(Routes.applicationCommands(clientId), {
            body: client.commandsToRegister
        }).then(_ => {
            console.log(`Successfully reloaded ${client.commandsToRegister.length} application (/) commands.`)
        }).catch((e: any) => {
            throw new Error(`Unable to reload ${client.commandsToRegister.length} global application (/) commands, ${e.message}`)
        })
    }
}


