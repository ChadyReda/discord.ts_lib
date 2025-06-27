import { ChatInputCommandInteraction, PermissionsBitField, ChannelType } from "discord.js";
import SuperClient from "../../../super_classes/SuperClient";
import { SuperEvent } from "../../../super_classes/SuperEvent";
import { SuperSlashCommand } from "../../../super_classes/SuperCommand";
import { MiddlewareType } from "../../../interfaces/IMiddleware";


export default new SuperEvent(
    {
        event: 'interactionCreate',
        once: false,
        run: async (client: SuperClient, interaction: ChatInputCommandInteraction) => {
            // return if the message is not from a guild or if the author is a bot
            if (!interaction.guild) return;

            // check if the instraction is a command
            if (!interaction.isCommand()) return;

            // check if the intraction is a slash command
            if (!interaction.isChatInputCommand()) return;

            // get the component from the selects collection
            const command: SuperSlashCommand = client.registry.slash_commands.get(interaction.commandName)!

            // return if the command doesn't exist
            if (!command) return;

            await client.registry.middlewareRunner.execute(client, MiddlewareType.GLOBAL, interaction);
            await client.registry.middlewareRunner.execute(client, MiddlewareType.SLASH, interaction);

            // check for the cooldown
            if (command.settings.cooldown! > 0) {
                const key = `s${interaction.user.id}${interaction.commandName}`
                const now = Date.now()
                const expiration_time = client.registry.cooldowns.get(key)
                if (expiration_time && now < expiration_time) {
                    const remaining = ((expiration_time - now) / 1000).toFixed(1);
                    if (interaction.isRepliable()) {
                        interaction.reply(`please wait ${remaining} seconds before using this command again.`);
                        return
                    }
                }

                client.registry.cooldowns.set(key, now + command.settings.cooldown!)
                setTimeout(() => client.registry.cooldowns.delete(key), command.settings.cooldown)
            }

            // check the bot perms
            for (const per of command.settings.botPermissions!) {
                if (!interaction.guild.members.me?.permissions.has(per)) {
                    if (interaction.isRepliable()) {
                        interaction.reply(`i need the \`${per}\` permission to execute this command.`);
                    }
                    return
                };
            }

            // check the member perms
            for (const per of command.settings.userPermissions!) {
                if (!(interaction.member?.permissions as PermissionsBitField).has(per)) {
                    if (interaction.isRepliable()) {
                        interaction.reply(`you need the \`${per}\` permission to use this command.`);
                    }
                    return
                };
            }

            // check the nsfw
            if (interaction.channel?.type === ChannelType.GuildText || interaction.channel?.type === ChannelType.GuildVoice) {
                if (command.settings.command.nsfw && !interaction.channel.nsfw) {
                    if (interaction.isRepliable()) {
                        interaction.reply('this command can only be used in nsfw channels.');
                    }
                    return
                }
            }

            // check the developers perm
            if (command.settings.developerOnly && !(process.env.DEVELOPER_ID == interaction.user.id)) {
                if (interaction.isRepliable()) {
                    interaction.reply('only developers can use this command.');
                }
                return
            }

            try {
                command.settings.run(client, interaction)
            } catch (err: any) {
                throw new Error(`An error occured while executing the command: ${command.settings.command.name}, ${err.message}`);
            }

        },
    }
)