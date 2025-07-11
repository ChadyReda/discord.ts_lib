import { SuperComponent }       from "@/super_classes/SuperComponent.js";
import   SuperClient            from "@/super_classes/SuperClient.js";
import { ComponentInteraction } from "@/interfaces/ISuperComponent.js";
import { SuperEvent }           from "@/super_classes/SuperEvent.js";
import { ChannelType, PermissionsBitField, EmbedBuilder } from "discord.js";
import { MiddlewareType }       from "@/interfaces/IMiddleware.js";

export default new SuperEvent({
    event: 'interactionCreate',
    once: false,
    run: async (client: SuperClient, interaction: ComponentInteraction) => {
        
        if (!interaction.guild) return;

        let component: SuperComponent | null = null;
        let type: string | null = null;

        if (interaction.isButton()) {
            type = 'b';
            component = client.registry.components.buttons.get(interaction.customId)!;
        }

        if (interaction.isModalSubmit()) {
            type = 'm';
            component = client.registry.components.modals.get(interaction.customId)!;
        }

        if (interaction.isAnySelectMenu()) {
            type = 's';
            component = client.registry.components.selects.get(interaction.customId)!;
        }

        if (!component) return;

        await client.registry.middlewareRunner.execute(client, MiddlewareType.GLOBAL, interaction);
        await client.registry.middlewareRunner.execute(client, MiddlewareType.COMPONENT, interaction);

        if (component.settings.cooldown! > 0) {
            const key = `${type}${interaction.user.id}${component.settings.id}`;
            const now = Date.now();
            const expiration_time = client.registry.cooldowns.get(key);
            if (expiration_time && now < expiration_time) {
                const remaining = ((expiration_time - now) / 1000).toFixed(1);
                if (component.settings.onCooldownFail) {
                    component.settings.onCooldownFail(client, interaction, remaining);
                    return;
                }
                if (interaction.isRepliable()) {
                    const cooldownEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('⏳ Cooldown Active')
                        .setDescription(`Please wait **${remaining} seconds** before using this again.`)
                        .setFooter({ text: 'Component interaction' });
                    await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
                }
                return;
            }
            client.registry.cooldowns.set(key, now + component.settings.cooldown!);
            setTimeout(() => client.registry.cooldowns.delete(key), component.settings.cooldown);
        }

        for (const per of component.settings.botPermissions!) {
            if (!interaction.guild.members.me?.permissions.has(per)) {
                if (component.settings.onBotPermissionsFail) {
                    component.settings.onBotPermissionsFail(client, interaction);
                    return;
                }
                if (interaction.isRepliable()) {
                    const permEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ Missing Permissions')
                        .setDescription('I don\'t have the required permissions to execute this action.')
                        .addFields(
                            { name: 'Required Permission', value: `\`${per}\``, inline: true }
                        )
                        .setFooter({ text: 'Please contact server staff' });
                    await interaction.reply({ embeds: [permEmbed], ephemeral: true });
                }
                return;
            }
        }

        for (const per of component.settings.userPermissions!) {
            if (!(interaction.member?.permissions as PermissionsBitField).has(per)) {
                if (component.settings.onUserPermissionsFail) {
                    component.settings.onUserPermissionsFail(client, interaction);
                    return;
                }
                if (interaction.isRepliable()) {
                    const permEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('❌ Access Denied')
                        .setDescription('You don\'t have permission to use this component.')
                        .addFields(
                            { name: 'Required Permission', value: `\`${per}\``, inline: true }
                        )
                        .setFooter({ text: 'Contact server staff if you believe this is an error' });
                    await interaction.reply({ embeds: [permEmbed], ephemeral: true });
                }
                return;
            }
        }
        
        if (component.settings.developerOnly && !(client.client_config.developers?.includes(interaction.user.id))) {
            if (component.settings.onDeveloperOnlyFail) {
                component.settings.onDeveloperOnlyFail(client, interaction);
                return;
            }
            if (interaction.isRepliable()) {
                const devEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('⚙️ Developer Only')
                    .setDescription('This component is restricted to bot developers only.')
                    .setFooter({ text: 'Component interaction' });
                await interaction.reply({ embeds: [devEmbed], ephemeral: true });
            }
            return;
        }
        
        if (interaction.channel?.type === ChannelType.GuildText || interaction.channel?.type === ChannelType.GuildVoice) {
            if (component.settings.nsfw && !interaction.channel.nsfw) {
                if (component.settings.onNsfwFail) {
                    component.settings.onNsfwFail(client, interaction);
                    return;
                }
                if (interaction.isRepliable()) {
                    const nsfwEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('🔞 NSFW Content')
                        .setDescription('This component can only be used in NSFW channels.')
                        .setFooter({ text: 'Please move to an appropriate channel' });
                    await interaction.reply({ embeds: [nsfwEmbed], ephemeral: true });
                }
                return;
            }
        }


        try {
            await component.settings.run(client, interaction);
        } catch (err: any) {
            console.error(`Error running component ${component.settings.id}:`, err);
            if (interaction.isRepliable() && !interaction.replied) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('⚠️ Unexpected Error')
                    .setDescription('An error occurred while processing your interaction.')
                    .setFooter({ text: 'The developers have been notified' });
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
});