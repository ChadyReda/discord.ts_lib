import { ContextMenuCommandBuilder, PermissionsString } from "discord.js";
import { ISuperContext, RunFunc, OnFailType } from "../interfaces/ISuperContext.js";


const default_context_settings: Partial<ISuperContext> = {
    userPermissions: [],
    botPermissions: [],
    developerOnly: false,
    cooldown: 0,
    nsfw: false,
    onUserPermissionsFail: () => { },
    onBotPermissionsFail: () => { },
    onDeveloperOnlyFail: () => { },
    onCooldownFail: () => { },
    onNsfwFail: () => { },
}

export class SuperContext extends ContextMenuCommandBuilder {
    settings: ISuperContext
    constructor(options: ISuperContext) {
        super();
        this.settings = { ...default_context_settings, ...options }
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
    setCooldown(cooldown: number) {
        this.settings.cooldown = cooldown
    }
    setOnUserPermissionsFail(onUserPermissionsFail: OnFailType) {
        this.settings.onUserPermissionsFail = onUserPermissionsFail
    }
    setOnBotPermissionsFail(onBotPermissionsFail: OnFailType) {
        this.settings.onBotPermissionsFail = onBotPermissionsFail
    }
    setOnDeveloperOnlyFail(onDeveloperOnlyFail: OnFailType) {
        this.settings.onDeveloperOnlyFail = onDeveloperOnlyFail
    }
    setOnCooldownFail(onCooldownFail: OnFailType) {
        this.settings.onCooldownFail = onCooldownFail
    }
    setOnNsfwFail(onNsfwFail: OnFailType) {
        this.settings.onNsfwFail = onNsfwFail
    }
    setRun(run: RunFunc) {
        this.settings.run = run
    }
}