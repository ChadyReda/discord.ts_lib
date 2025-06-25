import { AnySelectMenuInteraction, ButtonInteraction, ModalSubmitInteraction, PermissionsString } from "discord.js";
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

type ComponentInteraction =
  | ButtonInteraction
  | AnySelectMenuInteraction
  | ModalSubmitInteraction;


type RunFunc = (client: SuperClient, interaction: ComponentInteraction) => Promise<any> | any


export {
    ISuperComponent,
    RunFunc,
    ComponentInteraction
}