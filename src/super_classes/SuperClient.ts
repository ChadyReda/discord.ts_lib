import { Client, IntentsBitField, Partials, ActivityType, SlashCommandBuilder, ContextMenuCommandBuilder } from "discord.js";
import Registry from "./Registry";
import command_handler from "../handlers/command_handler";
import event_handler from "../handlers/event_handler";
import context_handler from "../handlers/context_handler";
import component_handler from "../handlers/component_handle";
import deploy_commands from "../handlers/deploy_commands";
import dotenv from "dotenv";
dotenv.config();

export default class SuperClient extends Client {
    commandsToRegister: SlashCommandBuilder[] & ContextMenuCommandBuilder[] = []
    registry = new Registry()
    constructor () {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages
                // add more if needed
            ],
            partials: [
                Partials.Channel,
                Partials.Message
                // add more if needed
            ],
            presence: {
                status: 'idle',
                activities: [
                    {
                        name: 'with discord.ts',
                        type: ActivityType.Streaming
                    }
                ]
            }
        })
    }
    async start (Token = process.env.TOKEN!) {
        try {
            if (!Token) throw new Error('No token provided');
            await command_handler(this);
            await event_handler(this);
            await context_handler(this);
            await component_handler(this);
            await deploy_commands(this);
            await this.login(Token);
        } catch (err: any) {
            console.log(err.message)
        }
    }
}