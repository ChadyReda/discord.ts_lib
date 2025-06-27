import { SlashCommandBuilder, PermissionsString } from "discord.js";
import { ISuperSlashCommand, ISuperMessageCommand, RunSlashFunc, RunMessageFunc, OnSFailType, OnMFailType } from "../interfaces/ISuperCommand";

const default_slashcommand_settings: Partial<ISuperSlashCommand> = {
    botPermissions: [],
    userPermissions: [],
    developerOnly: false,
    cooldown: 0,
    onBotPermissionsFail: () => { },
    onUserPermissionsFail: () => { },
    onDeveloperOnlyFail: () => { },
    onCooldownFail: () => { }
}

const default_messagecommand_settings: Partial<ISuperMessageCommand> = {
    userPermissions: [],
    botPermissions: [],
    aliases: [],
    nsfw: false,
    developerOnly: false,
    cooldown: 0,
    onBotPermissionsFail: () => { },
    onUserPermissionsFail: () => { },
    onDeveloperOnlyFail: () => { },
    onCooldownFail: () => { },
    onNsfwFail: () => { }, 
}


export class SuperSlashCommand extends SlashCommandBuilder {
    settings: ISuperSlashCommand
    constructor(options: ISuperSlashCommand) {
        super();
        this.settings = { ...default_slashcommand_settings, ...options }
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
    setOnUserPermissionsFail(onUserPermissionsFail: OnSFailType) {
        this.settings.onBotPermissionsFail = onUserPermissionsFail
    }
    setOnBotPermissionsFail(onBotPermissionsFail: OnSFailType) {
        this.settings.onBotPermissionsFail = onBotPermissionsFail
    }
    setOnDeveloperOnlyFail(onDeveloperOnlyFail: OnSFailType) {
        this.settings.onDeveloperOnlyFail = onDeveloperOnlyFail
    }
    setOnCooldownFail(onCooldownFail: OnSFailType) {
        this.settings.onCooldownFail = onCooldownFail
    }
    setCooldown(cooldown: number) {
        this.settings.cooldown = cooldown
    }
    setRun(run: RunSlashFunc) {
        this.settings.run = run
    }
}

export class SuperMessageCommand {
    settings: ISuperMessageCommand
    constructor(options: ISuperMessageCommand) {
        this.settings = { ...default_messagecommand_settings, ...options}
    }
    setName(name: string) {
        this.settings.name = name
    }
    setUserPermissions(userPermissions: PermissionsString[]) {
        this.settings.userPermissions = userPermissions
    }
    setBotPermissions(botPermissions: PermissionsString[]) {
        this.settings.botPermissions = botPermissions
    }
    setAliases(aliases: string[]) {
        this.settings.aliases = aliases
    }
    setDeveloperOnly(developerOnly: boolean) {
        this.settings.developerOnly = developerOnly
    }
    setCooldown(cooldown: number) {
        this.settings.cooldown = cooldown
    }
    setNsfw(nsfw: boolean) {
        this.settings.nsfw = nsfw
    }
    setOnUserPermissionsFail(onUserPermissionsFail: OnMFailType) {
        this.settings.onUserPermissionsFail = onUserPermissionsFail
    }
    setOnBotPermissionsFail(onBotPermissionsFail: OnMFailType) {
        this.settings.onBotPermissionsFail = onBotPermissionsFail
    }
    setOnDeveloperOnlyFail(onDeveloperOnlyFail: OnMFailType) {
        this.settings.onDeveloperOnlyFail = onDeveloperOnlyFail
    }
    setOnCooldownFail(onCooldownFail: OnMFailType) {
        this.settings.onCooldownFail = onCooldownFail
    }
    setOnNsfwFail(onNsfwFail: OnMFailType) {
        this.settings.onNsfwFail = onNsfwFail
    }
    setRun(run: RunMessageFunc) {
        this.settings.run = run
    }
}