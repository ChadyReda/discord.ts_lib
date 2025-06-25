import { ContextMenuCommandBuilder, PermissionsString } from "discord.js";
import { ISuperContext, RunFunc } from "../interfaces/ISuperContext";

export default class SuperContext extends ContextMenuCommandBuilder {
    settings: ISuperContext
    constructor(options: ISuperContext) {
        super();
        this.settings = options
    }
    setCommand(command: ContextMenuCommandBuilder) {
        this.settings.command = command
    }
    setBotPermissions(botPermissions: PermissionsString[]) {
        this.settings.botPermissions = botPermissions
    }
    setUserPermissions(userPermissions: PermissionsString[]) {
        this.settings.userPermissions = userPermissions
    }
    setDeveloperOnly(developerOnly: boolean) {
        this.settings.developerOnly = developerOnly
    }
    setNsfw(nsfw: boolean) {
        this.settings.nsfw = nsfw
    }
    setRun(run: RunFunc) {
        this.settings.run = run
    }
}