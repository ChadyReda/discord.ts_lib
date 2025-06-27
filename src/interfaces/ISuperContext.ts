import { ContextMenuCommandBuilder, ContextMenuCommandInteraction, PermissionsString } from "discord.js";
import SuperClient from "../super_classes/SuperClient";

type RunFunc = (client: SuperClient, interaction: ContextMenuCommandInteraction) => any
type CxMiddlwaresType = (client: SuperClient, interaction: ContextMenuCommandBuilder) => any
type OnFailType = (client: SuperClient, interaction: ContextMenuCommandInteraction) => any

interface ISuperContext {
    command: ContextMenuCommandBuilder,
    userPermissions?: PermissionsString[],
    botPermissions?: PermissionsString[],
    developerOnly?: boolean,
    cooldown?: number,
    nsfw?: boolean,
    onUserPermissionsFail?: OnFailType
    onBotPermissionsFail?: OnFailType
    onDeveloperOnlyFail?: OnFailType
    onCooldownFail?: OnFailType
    onNsfwFail?: OnFailType
    run: RunFunc
}

export {
    ISuperContext,
    RunFunc,
    OnFailType
}