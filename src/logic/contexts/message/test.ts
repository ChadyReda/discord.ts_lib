import SuperClient from "../../../super_classes/SuperClient";
import SuperContext from "../../../super_classes/SuperContext";
import { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";

export default new SuperContext(
    {
        command: new ContextMenuCommandBuilder()
        .setName('delete'),
        run: async (client: SuperClient, interaction: ContextMenuCommandInteraction) => {
            await interaction.reply('hheee message cannot be deleted')
        }        
    }
)