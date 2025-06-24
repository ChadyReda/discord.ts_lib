import { Interaction, PermissionsString } from "discord.js";
import SuperClient from "../super_classes/SuperClient";

interface ISuperComponent {
    id: string, 
    cooldown: number, 
    botPermissions: PermissionsString[],
    userPermissions: PermissionsString[],
    nsfw: boolean,
    developerOnly: boolean,
    run: RunFunc
}

type RunFunc = (client: SuperClient, interaction: Interaction) => Promise<void>


export {
    ISuperComponent,
    RunFunc
}