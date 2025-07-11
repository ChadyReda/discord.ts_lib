import { SuperMessageCommand, SuperSlashCommand} from "./SuperCommand.js"
import {SuperComponent} from "./SuperComponent.js"
import {SuperContext} from "./SuperContext.js"
import {MiddlewareRunner} from "./MiddlewareRunner.js";


export default class Registry {
    slash_commands = new Map<string, SuperSlashCommand>()
    prefix_commands = new Map<string, SuperMessageCommand>()
    prefix_aliases = new Map<string, string>()
    non_prefix_aliases = new Map<string, string>()
    non_prefix_commands = new Map<string, SuperMessageCommand>()
    context_menus = {
        user: new Map<string, SuperContext>(),
        message: new Map<string, SuperContext>()
    }
    components = {
        buttons: new Map<string, SuperComponent>(),
        selects: new Map<string, SuperComponent>(),
        modals: new Map<string, SuperComponent>()
    }
    cooldowns = new Map<string, any>()
    middlewareRunner: MiddlewareRunner = new MiddlewareRunner()

    registerSlash(name: string, command: SuperSlashCommand){
        this.slash_commands.set(name, command)
    }
    registerPrefix(name: string, command: SuperMessageCommand, aliases: string[] = []){
        this.prefix_commands.set(name, command)
        aliases.forEach(alias => this.prefix_aliases.set(alias, name))
    }
    registerNonPrefix(name: string, command: SuperMessageCommand, aliases: string[] = []){
        this.non_prefix_commands.set(name, command)
        aliases.forEach(alias => this.non_prefix_aliases.set(alias, name))
    }
    registerButton(id: string, component: SuperComponent){
        this.components.buttons.set(id, component)
    }
    registerModal(id: string, component: SuperComponent){
        this.components.modals.set(id, component)
    }
    registerSelect(id: string, component: SuperComponent){
        this.components.selects.set(id, component)
    }
    registerUserContext(name: string, component: SuperContext) {
        this.context_menus.user.set(name, component)
    }
    registerMessageContext(name: string, component: SuperContext) {
        this.context_menus.message.set(name, component)
    }
}