import { MiddlewareType } from "@/interfaces/IMiddleware.js";
import SuperClient from "@/super_classes/SuperClient.js";
import { SuperMessageCommand } from "@/super_classes/SuperCommand.js";
import { SuperEvent } from "@/super_classes/SuperEvent.js";
import { ChannelType, Message, EmbedBuilder } from "discord.js";

export default new SuperEvent({
    event: 'messageCreate',
    once: false,
    run: async (client: SuperClient, message: Message) => {
        try {
            // Ignore bots and DMs
            if (message.author.bot || !message.guild) return;

            const prefix = client.client_config.prefix;
            if (!prefix) throw new Error('No prefix provided in client configuration');

            // Parse command and arguments
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command_label = args.shift()?.toLowerCase();
            if (!command_label) return;

            // Find command (prefix or non-prefix)
            let command: SuperMessageCommand | undefined;
            if (message.content.startsWith(prefix)) {
                command = client.registry.prefix_commands.get(command_label) || 
                         client.registry.prefix_commands.get(client.registry.prefix_aliases.get(command_label)!);
            } else {
                command = client.registry.non_prefix_commands.get(command_label) || 
                         client.registry.non_prefix_commands.get(client.registry.non_prefix_aliases.get(command_label)!);
            }

            if (!command) return;

            // Execute middleware
            await client.registry.middlewareRunner.execute(client, MiddlewareType.GLOBAL, message);
            await client.registry.middlewareRunner.execute(client, MiddlewareType.MESSAGE, message);

            // Cooldown check with embed
            if (command.settings.cooldown! > 0) {
                const key = `p${message.author.id}${command_label}`;
                const now = Date.now();
                const expiration_time = client.registry.cooldowns.get(key);
                
                if (expiration_time && now < expiration_time) {
                    const remaining = ((expiration_time - now) / 1000).toFixed(1);
                    if (command.settings.onCooldownFail) {
                        await command.settings.onCooldownFail(client, message as any, remaining);
                        return;
                    }
                    const cooldownEmbed = new EmbedBuilder()
                        .setColor(0xF97316) // Orange
                        .setTitle('⏳ Command Cooldown')
                        .setDescription(`Please wait **${remaining} seconds** before using **${command_label}** again.`)
                        .setFooter({ text: 'Command cooling down' });
                    await message.reply({ embeds: [cooldownEmbed] });
                    return;
                }

                client.registry.cooldowns.set(key, now + command.settings.cooldown!);
                setTimeout(() => client.registry.cooldowns.delete(key), command.settings.cooldown);
            }

            // Bot permissions check with embed
            for (const per of command.settings.botPermissions!) {
                if (!message.guild.members.me?.permissions.has(per)) {
                    if (command.settings.onBotPermissionsFail) {
                        await command.settings.onBotPermissionsFail(client, message as any);
                        return;
                    }
                    const botPermEmbed = new EmbedBuilder()
                        .setColor(0xEF4444) // Red
                        .setTitle('❌ Missing Bot Permissions')
                        .setDescription(`I need the following permission to run this command:`)
                        .addFields(
                            { name: 'Required Permission', value: `\`${per}\``, inline: true },
                            { name: 'Command', value: command_label, inline: true }
                        )
                        .setFooter({ text: 'Please contact server administrators' });
                    await message.reply({ embeds: [botPermEmbed] });
                    return;
                }
            }

            // User permissions check with embed
            for (const per of command.settings.userPermissions!) {
                if (!message.member?.permissions.has(per)) {
                    if (command.settings.onUserPermissionsFail) {
                        await command.settings.onUserPermissionsFail(client, message as any);
                        return;
                    }
                    const userPermEmbed = new EmbedBuilder()
                        .setColor(0xEF4444) // Red
                        .setTitle('🔒 Permission Denied')
                        .setDescription(`You don't have permission to use this command.`)
                        .addFields(
                            { name: 'Required Permission', value: `\`${per}\``, inline: true },
                            { name: 'Command', value: command_label, inline: true }
                        )
                        .setFooter({ text: 'Contact server staff for assistance' });
                    await message.reply({ embeds: [userPermEmbed] });
                    return;
                }
            }

            // NSFW check with embed
            if (message.channel.type === ChannelType.GuildText || message.channel.type === ChannelType.GuildVoice) {
                if (command.settings.nsfw && !message.channel.nsfw) {
                    if (command.settings.onNsfwFail) {
                        await command.settings.onNsfwFail(client, message as any);
                        return;
                    }
                    const nsfwEmbed = new EmbedBuilder()
                        .setColor(0xEC4899) // Pink
                        .setTitle('🔞 NSFW Channel Required')
                        .setDescription(`**${command_label}** can only be used in NSFW channels.`)
                        .setFooter({ text: 'Age-restricted content requires NSFW channels' });
                    await message.reply({ embeds: [nsfwEmbed] });
                    return;
                }
            }

            // Developer check with embed
            if (command.settings.developerOnly && !client.client_config.developers?.includes(message.author.id)) {
                if (command.settings.onDeveloperOnlyFail) {
                    await command.settings.onDeveloperOnlyFail(client, message as any);
                    return;
                }
                const devEmbed = new EmbedBuilder()
                    .setColor(0x3B82F6) // Blue
                    .setTitle('⚙️ Developer Only Command')
                    .setDescription(`**${command_label}** is restricted to bot developers only.`)
                    .setFooter({ text: 'Protected system command' });
                await message.reply({ embeds: [devEmbed] });
                return;
            }

            // Execute command with error handling
            try {
                await command.settings.run(client, message as any, args);
            } catch (error) {
                console.error(`Error executing command ${command_label}:`, error);
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xEF4444) // Red
                    .setTitle('⚠️ Command Error')
                    .setDescription('An error occurred while executing this command.')
                    .setFooter({ text: 'Developers have been notified' });
                await message.reply({ embeds: [errorEmbed] });
            }

        } catch (error) {
            console.error('Error in message command handler:', error);
            // Fallback error response if something fails in the handler itself
            try {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xEF4444)
                    .setTitle('⚠️ System Error')
                    .setDescription('An unexpected error occurred while processing your command.');
                await message.reply({ embeds: [errorEmbed] });
            } catch (fallbackError) {
                console.error('Failed to send error message:', fallbackError);
            }
        }
    }
});