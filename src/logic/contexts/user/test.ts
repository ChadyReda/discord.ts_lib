import SuperClient from "../../../super_classes/SuperClient";
import SuperContext from "../../../super_classes/SuperContext";
import { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";

export default new SuperContext(
    {
        command: new ContextMenuCommandBuilder()
        .setName('ban'),
        botPermissions: [],
        userPermissions: ["Administrator"],
        cooldown: 10000,
        developerOnly: false,
        nsfw: false,
        run: async (client: SuperClient, interaction: ContextMenuCommandInteraction) => {
            await interaction.reply('no no no chill')
        }        
    }
)