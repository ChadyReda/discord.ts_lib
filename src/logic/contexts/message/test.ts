import SuperClient from "../../../super_classes/SuperClient";
import SuperContext from "../../../super_classes/SuperContext";
import { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";

export default new SuperContext(
    {
        command: new ContextMenuCommandBuilder()
        .setName('fimessco'),
        botPermissions: [],
        developerOnly: false,
        nsfw: false,
        run: async (client: SuperClient, interaction: ContextMenuCommandInteraction) => {
            await interaction.reply('hheee message context')
        }        
    }
)