import { SlashCommandBuilder, PermissionsString } from "discord.js";
import { ISuperSlashCommand, ISuperMessageCommand, RunSlashFunc, RunMessageFunc } from "../interfaces/ISuperCommand";

export class SuperSlashCommand extends SlashCommandBuilder {
    settings: ISuperSlashCommand
    constructor (options: ISuperSlashCommand) {
        super();
        this.settings = options
    }
    setBotPermissions (botPermissions: PermissionsString[]) {
        this.settings.botPermissions = botPermissions
    }
    setUserPermissions (userPermissions: PermissionsString[]) {
        this.settings.userPermissions = userPermissions
    }
    setDeveloperOnly (developerOnly: boolean) {
        this.settings.developerOnly = developerOnly
    }
    setCooldown (cooldown: number) {
        this.settings.cooldown = cooldown
    }
    setRun (run: RunSlashFunc) {
        this.settings.run = run
    }
    
}

export class SuperMessageCommand {
    settings: ISuperMessageCommand
    constructor (options: ISuperMessageCommand) {
        this.settings = options
    }
    setName (name: string) {
        this.settings.name = name
    }
    setUserPermissions (userPermissions: PermissionsString[]) {
        this.settings.userPermissions = userPermissions
    }
    setBotPermissions (botPermissions: PermissionsString[]) {
        this.settings.botPermissions = botPermissions
    }
    setAliases (aliases: string[]) {
        this.settings.aliases = aliases
    }
    setDeveloperOnly (developerOnly: boolean) {
        this.settings.developerOnly = developerOnly
    }
    setCooldown (cooldown: number) {
        this.settings.cooldown = cooldown
    }
    setRun (run: RunMessageFunc) {
        this.settings.run = run
    }
}