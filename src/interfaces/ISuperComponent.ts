import { AnySelectMenuInteraction, ButtonInteraction, ModalSubmitInteraction, PermissionsString } from "discord.js";
import SuperClient from "@/super_classes/SuperClient.js";


type CpMiddlwaresType = (client: SuperClient, interaction: ComponentInteraction) => any
type ComponentInteraction =
  | ButtonInteraction
  | AnySelectMenuInteraction
  | ModalSubmitInteraction;


type RunFunc = (client: SuperClient, interaction: ComponentInteraction) => Promise<any> | any
type OnFailType = (client: SuperClient, interaction: ComponentInteraction, ...any: any[]) => any

interface ISuperComponent {
    id: string, 
    cooldown?: number, 
    botPermissions?: PermissionsString[],
    userPermissions?: PermissionsString[],
    nsfw?: boolean,
    developerOnly?: boolean,
    onUserPermissionsFail?: OnFailType
    onBotPermissionsFail?: OnFailType
    onDeveloperOnlyFail?: OnFailType
    onCooldownFail?: OnFailType
    onNsfwFail?: OnFailType
    run: RunFunc
}



export {
  ISuperComponent,
  RunFunc,
  ComponentInteraction,
  OnFailType,
}