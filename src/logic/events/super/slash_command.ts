import { ChatInputCommandInteraction, PermissionsBitField, ChannelType } from "discord.js";
import SuperClient from "../../../super_classes/SuperClient";
import { SuperEvent } from "../../../super_classes/SuperEvent";
import { SuperSlashCommand } from "../../../super_classes/SuperCommand";

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

            // check for the cooldown
            if (command.settings.cooldown > 0) {
                // the cooldown key
                const key = `s${interaction.user.id}${interaction.commandName}`
                // if the user not under cooldown
                if (!client.registry.cooldowns.has(key)) {
                    client.registry.cooldowns.set(key, 0);
                    setTimeout(() => client.registry.cooldowns.delete(key), command.settings.cooldown);
                    // if the user is under cooldown
                } else {
                    interaction.reply(`please wait \`${command.settings.cooldown / 1000}\` seconds before using this command again.`);
                    return
                }
            }

            // check the bot perms
            for (const per of command.settings.botPermissions) {
                if (!interaction.guild.members.me?.permissions.has(per)) {
                    if (interaction.isRepliable()) {
                        interaction.reply(`i need the \`${per}\` permission to execute this command.`);
                    }
                    return
                };
            }

            // check the member perms
            for (const per of command.settings.userPermissions) {
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

            command.settings.run(client, interaction).catch((err: any) => {
                console.log("An error occured while executing the command: ", command.settings.command.name);
                console.log(err.message);
            })
        },
    }
)
