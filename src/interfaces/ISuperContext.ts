import { ContextMenuCommandBuilder, ContextMenuCommandInteraction, PermissionsString } from "discord.js";
import SuperClient from "../super_classes/SuperClient";

type RunFunc = (client: SuperClient, interaction: ContextMenuCommandInteraction) => Promise<any> | any

interface ISuperContext {
    command: ContextMenuCommandBuilder,
    botPermissions: PermissionsString[],
    developerOnly: boolean,
    nsfw: boolean,
    run: RunFunc
}

export {
    ISuperContext,
    RunFunc
}