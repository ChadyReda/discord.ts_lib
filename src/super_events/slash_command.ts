import { ChatInputCommandInteraction, PermissionsBitField, ChannelType, EmbedBuilder } from "discord.js";
import SuperClient from "@/super_classes/SuperClient.js";
import { SuperEvent } from "@/super_classes/SuperEvent.js";
import { SuperSlashCommand } from "@/super_classes/SuperCommand.js";
import { MiddlewareType } from "@/interfaces/IMiddleware.js";

export default new SuperEvent({
    event: 'interactionCreate',
    once: false,
    run: async (client: SuperClient, interaction: ChatInputCommandInteraction) => {
        if (!interaction.guild) return;
        if (!interaction.isCommand() || !interaction.isChatInputCommand()) return;

        const command: SuperSlashCommand = client.registry.slash_commands.get(interaction.commandName)!;
        if (!command) return;

        await client.registry.middlewareRunner.execute(client, MiddlewareType.GLOBAL, interaction);
        await client.registry.middlewareRunner.execute(client, MiddlewareType.SLASH, interaction);

        // Cooldown check with embed
        if (command.settings.cooldown! > 0) {
            const key = `s${interaction.user.id}${interaction.commandName}`;
            const now = Date.now();
            const expiration_time = client.registry.cooldowns.get(key);
            
            if (expiration_time && now < expiration_time) {
                const remaining = ((expiration_time - now) / 1000).toFixed(1);
                if (command.settings.onCooldownFail) {
                    command.settings.onCooldownFail(client, interaction, remaining);
                    return;
                }
                if (interaction.isRepliable()) {
                    const cooldownEmbed = new EmbedBuilder()
                        .setColor(0xF97316) // Orange
                        .setTitle('⏳ Command Cooldown')
                        .setDescription(`You're using \`/${interaction.commandName}\` too fast!`)
                        .addFields(
                            { name: 'Time Remaining', value: `${remaining} seconds`, inline: true },
                            { name: 'Total Cooldown', value: `${command.settings.cooldown! / 1000} seconds`, inline: true }
                        )
                        .setFooter({ text: 'Please wait before trying again' });
                    await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
                }
                return;
            }

            client.registry.cooldowns.set(key, now + command.settings.cooldown!);
            setTimeout(() => client.registry.cooldowns.delete(key), command.settings.cooldown);
        }

        // Bot permissions check with embed
        for (const per of command.settings.botPermissions!) {
            if (!interaction.guild.members.me?.permissions.has(per)) {
                if (command.settings.onBotPermissionsFail) {
                    command.settings.onBotPermissionsFail(client, interaction);
                    return;
                }
                if (interaction.isRepliable()) {
                    const botPermEmbed = new EmbedBuilder()
                        .setColor(0xEF4444) // Red
                        .setTitle('❌ Bot Missing Permissions')
                        .setDescription(`I can't execute \`/${interaction.commandName}\` because I'm missing required permissions.`)
                        .addFields(
                            { name: 'Missing Permission', value: `\`${per}\``, inline: true },
                            { name: 'Solution', value: 'Ask server admins to grant me this permission', inline: true }
                        )
                        .setFooter({ text: 'Permission required to execute this command' });
                    await interaction.reply({ embeds: [botPermEmbed], ephemeral: true });
                }
                return;
            }
        }

        // User permissions check with embed
        for (const per of command.settings.userPermissions!) {
            if (!(interaction.member?.permissions as PermissionsBitField).has(per)) {
                if (command.settings.onUserPermissionsFail) {
                    command.settings.onUserPermissionsFail(client, interaction);
                    return;
                }
                if (interaction.isRepliable()) {
                    const userPermEmbed = new EmbedBuilder()
                        .setColor(0xEF4444) // Red
                        .setTitle('🔒 Permission Denied')
                        .setDescription(`You don't have permission to use \`/${interaction.commandName}\``)
                        .addFields(
                            { name: 'Required Permission', value: `\`${per}\``, inline: true },
                            { name: 'How to get access?', value: 'Contact server staff', inline: true }
                        )
                        .setFooter({ text: 'Check your server roles for this permission' });
                    await interaction.reply({ embeds: [userPermEmbed], ephemeral: true });
                }
                return;
            }
        }
        
        // Developer check with embed
        if (command.settings.developerOnly && !(client.client_config.developers?.includes(interaction.user.id))) {
            if (command.settings.onDeveloperOnlyFail) {
                command.settings.onDeveloperOnlyFail(client, interaction);
                return;
            }
            if (interaction.isRepliable()) {
                const devEmbed = new EmbedBuilder()
                    .setColor(0x3B82F6) // Blue
                    .setTitle('⚙️ Developer Only Command')
                    .setDescription(`\`/${interaction.commandName}\` is restricted to bot developers.`)
                    .addFields(
                        { name: 'Your ID', value: interaction.user.id, inline: true },
                    )
                    .setFooter({ text: 'This is a protected system command' });
                await interaction.reply({ embeds: [devEmbed], ephemeral: true });
            }
            return;
        }
        
        // NSFW check with embed
        if (interaction.channel?.type === ChannelType.GuildText || interaction.channel?.type === ChannelType.GuildVoice) {
            if (command.settings.nsfw && !interaction.channel.nsfw) {
                if (command.settings.onNsfwFail) {
                    command.settings.onNsfwFail(client, interaction);
                    return;
                }
                if (interaction.isRepliable()) {
                    const nsfwEmbed = new EmbedBuilder()
                        .setColor(0xEC4899) // Pink
                        .setTitle('🔞 NSFW Command')
                        .setDescription(`\`/${interaction.commandName}\` can only be used in NSFW channels.`)
                        .addFields(
                            { name: 'Current Channel', value: interaction.channel.toString(), inline: true },
                            { name: 'Required Setting', value: 'NSFW Enabled', inline: true }
                        )
                        .setFooter({ text: 'Age-restricted content requires NSFW channels' });
                    await interaction.reply({ embeds: [nsfwEmbed], ephemeral: true });
                }
                return;
            }
        }


        // Execute command with error handling and embed
        try {
            await command.settings.run(client, interaction);
        } catch (err: any) {
            console.error(`Error executing command /${interaction.commandName}:`, err);
            if (interaction.isRepliable() && !interaction.replied) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xEF4444) // Red
                    .setTitle('⚠️ Command Error')
                    .setDescription(`An error occurred while executing \`/${interaction.commandName}\``)
                    .addFields(
                        { name: 'Error Type', value: err.name || 'Unknown', inline: true },
                        { name: 'Status', value: 'Reported to developers', inline: true }
                    )
                    .setFooter({ text: 'Sorry for the inconvenience!' });
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
            throw new Error(`Error executing command /${command.settings.command.name}: ${err.message}`);
        }
    }
});