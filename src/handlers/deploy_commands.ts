import { Routes, REST } from "discord.js";
import SuperClient from "../super_classes/SuperClient";
import dotenv from "dotenv";
dotenv.config();



export default async function (client: SuperClient) {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

    console.log(`Started refreshing ${client.commandsToRegister.length} application (/) commands.`)
    const guildId = process.env.DEV_GUILD_ID
    const useDev = process.env.ON_DEV
    if (guildId && useDev) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID!, guildId), {
            body: client.commandsToRegister
        }).then(_ => {
            console.log(`Successfully reloaded ${client.commandsToRegister.length} application (/) commands to guild ${guildId}.`)
        }).catch((e: any) => {
            throw new Error(`Unable to reload ${client.commandsToRegister.length} application (/) commands to guild ${guildId}, ${e.message}`)
        })
    } else {
        rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
            body: client.commandsToRegister
        }).then(_ => {
            console.log(`Successfully reloaded ${client.commandsToRegister.length} application (/) commands.`)
        }).catch((e: any) => {
            throw new Error(`Unable to reload ${client.commandsToRegister.length} global application (/) commands, ${e.message}`)
        })
    }
}


