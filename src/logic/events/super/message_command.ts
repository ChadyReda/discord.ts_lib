import SuperClient from "../../../super_classes/SuperClient";
import { SuperMessageCommand } from "../../../super_classes/SuperCommand";
import { SuperEvent } from "../../../super_classes/SuperEvent";
import { ChannelType, Message } from "discord.js";


export default new SuperEvent({
    event: 'messageCreate',
    once: false,
    run: async (client: SuperClient, message: Message) => {

        if (message.author.bot || !message.guild) return // message from a bot or not from a guild
        
        const args = message.content.slice(client.registry.prefix.length).trim().split(/ +/); // remove the bot prefix and split the message into an array of arguments
        
        const command_label = args.shift()?.toLowerCase();
        
        if (!command_label) return 

        let command: SuperMessageCommand;

        if (message.content.startsWith(client.registry.prefix)) {
            command = client.registry.prefix_commands.get(command_label)!
            || client.registry.prefix_commands.get(client.registry.prefix_aliases.get(command_label)!)
        } else {
            command = client.registry.non_prefix_commands.get(command_label)!
            || client.registry.non_prefix_commands.get(client.registry.non_prefix_aliases.get(command_label)!)
        }
        
        if (!command) return

        if (command.settings.cooldown! > 0) {
            const key = `p${message.author.id}${command_label}`
            const now = Date.now()
            const expiration_time = client.registry.cooldowns.get(key)
            if (expiration_time && now < expiration_time) {
                const remaining = ((expiration_time - now) / 1000).toFixed(1);
                message.reply(`please wait ${remaining} seconds before using this command again.`)
                return
            }
            client.registry.cooldowns.set(key, now + command.settings.cooldown!)
            setTimeout(() => client.registry.cooldowns.delete(key), command.settings.cooldown)
        }

        for (const per of command.settings.botPermissions!) {
            if (!message.guild.members.me?.permissions.has(per)) {
                message.reply(`i need the \`${per}\` permission to execute this command.`);
                return
            }
        }

        for (const per of command.settings.userPermissions!) {
            if (!message.member?.permissions.has(per)) {
                message.reply(`you need the \`${per}\` permission to execute this command.`);
                return
            }
        }

        if (message.channel.type == ChannelType.GuildText || message.channel.type == ChannelType.GuildVoice) {
            if (command.settings.nsfw && !message.channel.nsfw) {
                message.reply('this command can only be used in NSFW channels.');
                return
            }
        }

        if (command.settings.developerOnly && !(message.author.id == process.env.DEVELOPER_ID)) {
            message.reply('this command can only be used by developers.');
            return
        }

        command.settings.run(client, message as any, args).catch((err: any) => {
            console.log(`Error executing message command ${command.settings.name}: ${err.message}`)
        })

    }
})  