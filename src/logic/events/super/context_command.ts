import SuperContext from "../../../super_classes/SuperContext";
import SuperClient from "../../../super_classes/SuperClient";
import { ChannelType, ContextMenuCommandInteraction, PermissionsBitField } from 'discord.js'
import { SuperEvent } from "../../../super_classes/SuperEvent";


export default new SuperEvent ({
    event: 'interactionCreate',
    once: false,
    run: async (client: SuperClient, interaction: ContextMenuCommandInteraction) => {
        
        if (!interaction.guild) return

        if (!interaction.isCommand()) return

        if (interaction.isMessageContextMenuCommand()) {

            const context_menu: SuperContext = client.registry.context_menus.message.get(interaction.commandName)!
            if (!context_menu) return;

            if (context_menu.settings.cooldown! > 0) {
                const key = `m${interaction.user.id}${interaction.commandName}`
                const now = Date.now()
                const expiration_time = client.registry.cooldowns.get(key)
                if (expiration_time && now < expiration_time) {
                    const remaining = ((expiration_time - now) / 1000).toFixed(1);
                    if (interaction.isRepliable()) {
                        interaction.reply(`please wait ${remaining} seconds before using this command again.`)
                        return
                    }
                }

                client.registry.cooldowns.set(key, now + context_menu.settings.cooldown!)
                setTimeout(() => client.registry.cooldowns.delete(key), context_menu.settings.cooldown)
            }
            
            for (const per of context_menu.settings.botPermissions!) {
                if (!interaction.guild.members.me?.permissions.has(per)) {
                    if (interaction.isRepliable()) {
                        interaction.reply(`i need the \`${per}\` permission to execute this command.`)
                    }
                    return
                }
            }
            
            for (const per of context_menu.settings.userPermissions!) {
                if (!(interaction.member?.permissions as PermissionsBitField).has(per)) {
                    if (interaction.isRepliable()) {
                        interaction.reply(`i need the \`${per}\` permission to execute this command.`);
                    }
                    return
                }
            }

            if (interaction.channel?.type === ChannelType.GuildText || interaction.channel?.type === ChannelType.GuildVoice) {
                if (context_menu.settings.nsfw && !interaction.channel.nsfw) {
                    if (interaction.isRepliable()) {
                        interaction.reply('this command can only be used in nsfw channels.');
                    }
                    return
                }
            }

            if (context_menu.settings.developerOnly && !(interaction.user.id === process.env.DEVELOPER_ID)) {
                if (interaction.isRepliable()) {
                    interaction.reply('this command can only be used by the developer.');
                }
                return
            }

            context_menu.settings.run(client, interaction).catch((err: any) => {
                console.log(`Error executing message command ${context_menu.settings.command.name}: ${err.message}`)
            })
        } else if (interaction.isUserContextMenuCommand()) {
            
            const context_menu: SuperContext = client.registry.context_menus.user.get(interaction.commandName)!
            if (!context_menu) return;

            if (context_menu.settings.cooldown! > 0) {
                const key = `u${interaction.user.id}${interaction.commandName}`
                const now = Date.now()
                const expiration_time = client.registry.cooldowns.get(key)
                if (expiration_time && now < expiration_time) {
                    const remaining = ((expiration_time - now) / 1000).toFixed(1);
                    if (interaction.isRepliable()) {
                        interaction.reply(`please wait ${remaining} seconds before using this command again.`)
                        return
                    }
                }
                client.registry.cooldowns.set(key, now + context_menu.settings.cooldown!)
                setTimeout(() => client.registry.cooldowns.delete(key), context_menu.settings.cooldown)
            }

            for (const per of context_menu.settings.botPermissions!) {
                if (!interaction.guild.members.me?.permissions.has(per)) {
                    if (interaction.isRepliable()) {
                        interaction.reply(`i need the \`${per}\` permission to execute this command.`)
                    }
                    return
                }
            }
            
            for (const per of context_menu.settings.userPermissions!) {
                if (!(interaction.member?.permissions as PermissionsBitField).has(per)) {
                    if (interaction.isRepliable()) {
                        interaction.reply(`i need the \`${per}\` permission to execute this command.`);
                    }
                    return
                }
            }

            if (interaction.channel?.type === ChannelType.GuildText || interaction.channel?.type === ChannelType.GuildVoice) {
                if (context_menu.settings.nsfw && !interaction.channel.nsfw) {
                    if (interaction.isRepliable()) {
                        interaction.reply('this command can only be used in nsfw channels.');
                    }
                    return
                }
            }

            if (context_menu.settings.developerOnly && !(interaction.user.id === process.env.DEVELOPER_ID)) {
                if (interaction.isRepliable()) {
                    interaction.reply('this command can only be used by the developer.');
                }
                return
            }

            context_menu.settings.run(client, interaction).catch((err: any) => {
                console.log(`Error executing message command ${context_menu.settings.command.name}: ${err.message}`)
            })
        }   
    }
})