import { SlashCommandBuilder, Interaction} from "discord.js";
import { SuperSlashCommand } from "../../../../super_classes/SuperCommand";
import SuperClient from "../../../../super_classes/SuperClient";


export default new SuperSlashCommand({
    command: new SlashCommandBuilder()
    .setName('help')
    .setDescription('shows all the help options'),
    developerOnly: false,
    botPermissions: [],
    cooldown: 0,
    run: async (client: SuperClient, interaction: Interaction) => {
        console.log(interaction.user.id, 'used /help')
    }
})