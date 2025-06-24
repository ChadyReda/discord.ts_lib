import { PermissionsString } from "discord.js"
import { ISuperComponent, RunFunc } from "../interfaces/ISuperComponent"


export default class SuperComponent {
    settings: ISuperComponent
    constructor (options: ISuperComponent) {
        this.settings = options
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
    setRun (run: RunFunc) {
        this.settings.run = run
    }
}