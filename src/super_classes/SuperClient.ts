import { Client, PresenceStatusData, Partials, ActivityType, GatewayIntentBits , SlashCommandBuilder, ContextMenuCommandBuilder } from "discord.js";
import Registry from "./Registry.js";
import super_handler from "@/handlers/super_handler.js";


interface IBotConfig {
    token: string
    prefix?: string
    developers?: string[]
    guild_id: string
    client_id: string
    dev_mode?: boolean
    status?: PresenceStatusData
    intents?: GatewayIntentBits[]
    partials?: Partials[]
    activity_name?: string,
    activity_type?: ActivityType
    location?: {
        base?: string
        commands?: string
        components?: string
        context_menus?: string
        middlewares?: string
        slash_commands?: string
        database?: string
        events?: string
    }
}

const defaultBotConfig: Partial<IBotConfig> = {
    prefix: '!',
    developers: [],
    dev_mode: true,
    status: 'online',
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ],
    activity_name: 'with discord.ts',
    activity_type: ActivityType.Streaming,
}


export default class SuperClient extends Client {
    
    commandsToRegister: SlashCommandBuilder[] & ContextMenuCommandBuilder[] = []
    registry = new Registry()
    client_config: IBotConfig;
    
    constructor (config: IBotConfig) {
        const clientconfig: IBotConfig = {...defaultBotConfig, ...config}

        super({
            intents: clientconfig.intents!,
            partials: clientconfig.partials!,
            presence: {
                status: clientconfig.status!,
                activities: [
                    {
                        name: clientconfig.activity_name!,
                        type: clientconfig.activity_type!
                    }
                ]
            }
        })

        this.client_config = clientconfig
    }

    async start () {
        try {
            await super_handler(this)
        } catch (err: any) {
            console.log(err.message)
            throw new Error(`Unable to start the bot, ${err.message}`);
        }
    }
}