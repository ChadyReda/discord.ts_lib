import { ActionRowBuilder, Message, ButtonBuilder, ButtonStyle } from "discord.js";
import SuperClient from "../../../../super_classes/SuperClient";
import { SuperMessageCommand } from "../../../../super_classes/SuperCommand";


export default new SuperMessageCommand({
    name: 'help',
    aliases: ['aide', 'helfe'],
    botPermissions: [],
    userPermissions: [],
    nsfw: false,
    developerOnly: false,
    cooldown: 0,
    run: async (client: SuperClient, message: Message, args: any) => {
        await message.reply({content: 'what do you want', components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setCustomId('testbutton').setLabel('test').setStyle(ButtonStyle.Danger),
            ),
        ]})
    }
})
