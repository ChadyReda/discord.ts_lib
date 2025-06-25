import { ContextMenuCommandBuilder, ContextMenuCommandInteraction, PermissionsString } from "discord.js";
import SuperClient from "../super_classes/SuperClient";

type RunFunc = (client: SuperClient, interaction: ContextMenuCommandInteraction) => Promise<any> | any

interface ISuperContext {
    command: ContextMenuCommandBuilder,
    userPermissions: PermissionsString[],
    botPermissions: PermissionsString[],
    developerOnly: boolean,
    cooldown: number,
    nsfw: boolean,
    run: RunFunc
}

export {
    ISuperContext,
    RunFunc
}