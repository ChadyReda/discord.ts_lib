import { SlashCommandBuilder } from "discord.js";
import { SuperSlashCommand } from "../../../../super_classes/SuperCommand";
import SuperClient from "../../../../super_classes/SuperClient";
import { ChatInputCommandInteraction } from "discord.js";

export default new SuperSlashCommand({
    command: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('ban someone'),
    run: async (client: SuperClient, interaction: ChatInputCommandInteraction) => {
        await interaction.reply('ban ban ban')
    }
})