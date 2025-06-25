import SuperClient from "../../../super_classes/SuperClient";
import SuperComponent from "../../../super_classes/SuperComponent";
import { ComponentInteraction } from "../../../interfaces/ISuperComponent";

export default new SuperComponent(
    {
        id: "testbutton",
        cooldown: 0,
        developerOnly: false,
        nsfw: false,
        botPermissions: [],
        userPermissions: [],
        run: async (client: SuperClient, interaction: ComponentInteraction) => {
            await interaction.reply('first button')
        }
    }
)