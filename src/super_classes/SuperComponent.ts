import { PermissionsString } from "discord.js"
import { ISuperComponent, RunFunc, OnFailType } from "../interfaces/ISuperComponent.js"


const default_component_settings: Partial<ISuperComponent> = {
    botPermissions: [],
    userPermissions: [],
    nsfw: false,
    onBotPermissionsFail: () => { },
    onUserPermissionsFail: () => { },
    onDeveloperOnlyFail: () => { },
    onCooldownFail: () => { },
    onNsfwFail: () => { }, 
    developerOnly: false,
    cooldown: 0
}

export class SuperComponent {
    settings: ISuperComponent
    constructor (options: ISuperComponent) {
        this.settings = { ...default_component_settings, ...options }
    }
    setId (id: string) {
        this.settings.id = id
    }
    setCooldown (cooldown: number) {
        this.settings.cooldown = cooldown
    }
    setBotPermissions (botPermissions: PermissionsString[]) {
        this.settings.botPermissions = botPermissions
    }
    setUserPermissions (userPermissions: PermissionsString[]) {
        this.settings.userPermissions = userPermissions
    }
    setNsfw (nsfw: boolean) {
        this.settings.nsfw = nsfw
    }
    setDeveloperOnly (developerOnly: boolean) {
        this.settings.developerOnly = developerOnly
    }
    setOnUserPermissionsFail (onUserPermissionsFail: OnFailType) {
        this.settings.onUserPermissionsFail = onUserPermissionsFail
    }
    setOnBotPermissionsFail (onBotPermissionsFail: OnFailType) {
        this.settings.onBotPermissionsFail = onBotPermissionsFail
    }
    setOnDeveloperOnlyFail (onDeveloperOnlyFail: OnFailType) {
        this.settings.onDeveloperOnlyFail = onDeveloperOnlyFail
    }
    setOnCooldownFail (onCooldownFail: OnFailType) {
        this.settings.onCooldownFail = onCooldownFail
    }
    setOnNsfwFail (onNsfwFail: OnFailType) {
        this.settings.onNsfwFail = onNsfwFail
    }
    setRun (run: RunFunc) {
        this.settings.run = run
    }
}