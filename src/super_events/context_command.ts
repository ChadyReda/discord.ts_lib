import { SuperContext } from "@/super_classes/SuperContext.js";
import SuperClient from "@/super_classes/SuperClient.js";
import { ChannelType, ContextMenuCommandInteraction, PermissionsBitField, EmbedBuilder } from 'discord.js';
import { SuperEvent } from "@/super_classes/SuperEvent.js";
import { MiddlewareType } from "@/interfaces/IMiddleware.js";

export default new SuperEvent({
    event: 'interactionCreate',
    once: false,
    run: async (client: SuperClient, interaction: ContextMenuCommandInteraction) => {
        
        if (!interaction.guild) return;
        if (!interaction.isCommand()) return;

        if (interaction.isContextMenuCommand()) {
            await client.registry.middlewareRunner.execute(client, MiddlewareType.GLOBAL, interaction);
            await client.registry.middlewareRunner.execute(client, MiddlewareType.CONTEXT, interaction);
        }

        const handleContextMenu = async (context_menu: SuperContext, type: 'message' | 'user') => {
            if (!context_menu) return;

            // Cooldown check
            if (context_menu.settings.cooldown! > 0) {
                const key = `${type === 'message' ? 'm' : 'u'}${interaction.user.id}${interaction.commandName}`;
                const now = Date.now();
                const expiration_time = client.registry.cooldowns.get(key);
                
                if (expiration_time && now < expiration_time) {
                    const remaining = ((expiration_time - now) / 1000).toFixed(1);
                    if (context_menu.settings.onCooldownFail) {
                        context_menu.settings.onCooldownFail(client, interaction, remaining);
                        return;
                    }
                    if (interaction.isRepliable()) {
                        const cooldownEmbed = new EmbedBuilder()
                            .setColor(0xFFA500)
                            .setTitle('⏳ Command Cooldown')
                            .setDescription(`Please wait **${remaining} seconds** before using \`/${interaction.commandName}\` again.`)
                            .setFooter({ text: 'Too fast! Slow down a bit' });
                        await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
                    }
                    return;
                }

                client.registry.cooldowns.set(key, now + context_menu.settings.cooldown!);
                setTimeout(() => client.registry.cooldowns.delete(key), context_menu.settings.cooldown);
            }

            // Bot permissions check
            for (const per of context_menu.settings.botPermissions!) {
                if (!interaction.guild?.members.me?.permissions.has(per)) {
                    if (context_menu.settings.onBotPermissionsFail) {
                        context_menu.settings.onBotPermissionsFail(client, interaction);
                        return;
                    }
                    if (interaction.isRepliable()) {
                        const botPermEmbed = new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('❌ Missing Bot Permissions')
                            .setDescription(`I need the **${per}** permission to execute this command.`)
                            .addFields(
                                { name: 'Command', value: `\`/${interaction.commandName}\``, inline: true },
                                { name: 'Required Permission', value: `\`${per}\``, inline: true }
                            )
                            .setFooter({ text: 'Please contact server administrators' });
                        await interaction.reply({ embeds: [botPermEmbed], ephemeral: true });
                    }
                    return;
                }
            }

            // User permissions check
            for (const per of context_menu.settings.userPermissions!) {
                if (!(interaction.member?.permissions as PermissionsBitField).has(per)) {
                    if (context_menu.settings.onUserPermissionsFail) {
                        context_menu.settings.onUserPermissionsFail(client, interaction);
                        return;
                    }
                    if (interaction.isRepliable()) {
                        const userPermEmbed = new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('🔒 Permission Denied')
                            .setDescription(`You need the **${per}** permission to use this command.`)
                            .addFields(
                                { name: 'Command', value: `\`/${interaction.commandName}\``, inline: true },
                                { name: 'Required Permission', value: `\`${per}\``, inline: true }
                            )
                            .setFooter({ text: 'Contact staff if you need access' });
                        await interaction.reply({ embeds: [userPermEmbed], ephemeral: true });
                    }
                    return;
                }
            }
            
            // Developer check
            if (context_menu.settings.developerOnly && !(client.client_config.developers?.includes(interaction.user.id))) {
                if (context_menu.settings.onDeveloperOnlyFail) {
                    context_menu.settings.onDeveloperOnlyFail(client, interaction);
                    return;
                }
                if (interaction.isRepliable()) {
                    const devEmbed = new EmbedBuilder()
                        .setColor(0x7289DA)
                        .setTitle('⚙️ Developer Restricted')
                        .setDescription(`\`/${interaction.commandName}\` is reserved for bot developers only.`)
                        .setFooter({ text: 'This is a protected command' });
                    await interaction.reply({ embeds: [devEmbed], ephemeral: true });
                }
                return;
            }

            // NSFW check
            if (interaction.channel?.type === ChannelType.GuildText || interaction.channel?.type === ChannelType.GuildVoice) {
                if (context_menu.settings.nsfw && !interaction.channel.nsfw) {
                    if (context_menu.settings.onNsfwFail) {
                        context_menu.settings.onNsfwFail(client, interaction);
                        return;
                    }
                    if (interaction.isRepliable()) {
                        const nsfwEmbed = new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('🔞 NSFW Channel Required')
                            .setDescription(`\`/${interaction.commandName}\` can only be used in NSFW-marked channels.`)
                            .setFooter({ text: 'This content requires age verification' });
                        await interaction.reply({ embeds: [nsfwEmbed], ephemeral: true });
                    }
                    return;
                }
            }


            // Execute command with error handling
            try {
                await context_menu.settings.run(client, interaction);
            } catch (err: any) {
                console.error(`Error executing ${type} context command ${interaction.commandName}:`, err);
                if (interaction.isRepliable() && !interaction.replied) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('⚠️ Command Error')
                        .setDescription('An unexpected error occurred while executing this command.')
                        .setFooter({ text: 'Developers have been notified' });
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            }
        };

        if (interaction.isMessageContextMenuCommand()) {
            const context_menu = client.registry.context_menus.message.get(interaction.commandName);
            if (!context_menu) return;
            await handleContextMenu(context_menu, 'message');
        } else if (interaction.isUserContextMenuCommand()) {
            const context_menu = client.registry.context_menus.user.get(interaction.commandName);
            if (!context_menu) return;
            await handleContextMenu(context_menu, 'user');
        }
    }
});