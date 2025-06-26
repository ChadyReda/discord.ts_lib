import SuperComponent from "../../../super_classes/SuperComponent";
import SuperClient from "../../../super_classes/SuperClient";
import { ComponentInteraction } from "../../../interfaces/ISuperComponent";
import { SuperEvent } from "../../../super_classes/SuperEvent";
import { ChannelType, PermissionsBitField } from "discord.js";


export default new SuperEvent({
    event: 'interactionCreate',
    once: false,
    run: async (client: SuperClient, interaction: ComponentInteraction) => {
        if (!interaction.guild) return

        let component: SuperComponent | null = null
        let type: string | null = null

        if (interaction.isButton()) {
            type = 'b'
            component = client.registry.components.buttons.get(interaction.customId)!
        }

        if (interaction.isModalSubmit()) {
            type = 'm'
            component = client.registry.components.modals.get(interaction.customId)!
        }

        if (interaction.isAnySelectMenu()) {
            type = 's'
            component = client.registry.components.selects.get(interaction.customId)!
        }

        if (!component) return


        if (component.settings.cooldown! > 0) {
            const key = `${type}${interaction.user.id}${component.settings.id}`
            const now = Date.now()
            const expiration_time = client.registry.cooldowns.get(key)
            if (expiration_time && now < expiration_time) {
                const remaining = ((expiration_time - now) / 1000).toFixed(1);
                if (interaction.isRepliable()) {
                    interaction.reply(`please wait ${remaining} seconds before using this component again.`)
                }
                return
            }
            client.registry.cooldowns.set(key, now + component.settings.cooldown!)
            setTimeout(() => client.registry.cooldowns.delete(key), component.settings.cooldown)
        }


        for (const per of component.settings.botPermissions!) {
            if (!interaction.guild.members.me?.permissions.has(per)) {
                if (interaction.isRepliable()) {
                    interaction.reply('you do not have the required permissions to use this component.')
                }
                return
            }
        }

        for (const per of component.settings.userPermissions!) {
            if (!(interaction.member?.permissions as PermissionsBitField).has(per)) {
                if (interaction.isRepliable()) {
                    interaction.reply('you do not have the required permissions to use this component.')
                }
                return
            }
        }

        if (interaction.channel?.type === ChannelType.GuildText || interaction.channel?.type === ChannelType.GuildVoice) {
            if (component.settings.nsfw && !interaction.channel.nsfw) {
                if (interaction.isRepliable()) {
                    interaction.reply('this component can only be used in nsfw channels.')
                }
                return
            }
        }

        if (component.settings.developerOnly && !(interaction.user.id !== process.env.DEVELOPER_ID)) {
            if (interaction.isRepliable()) {
                interaction.reply('this component can only be used by developers.')
            }
            return
        }

        component.settings.run(client, interaction).catch((err: any) => {
            console.log(`Error running component ${component.settings.id}: ${err.message}`)
        })
    }
})