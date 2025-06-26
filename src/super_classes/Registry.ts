import { SuperMessageCommand, SuperSlashCommand} from "./SuperCommand"
import SuperComponent from "./SuperComponent"
import SuperContext from "./SuperContext"
import { CxMiddlwaresType } from "../interfaces/ISuperContext";
import { CpMiddlwaresType } from "../interfaces/ISuperComponent";
import { MMiddlwaresType, SMiddlwaresType } from "../interfaces/ISuperCommand";
import SuperClient from "./SuperClient";

type GlobalMiddlwaresType = (client: SuperClient, ...args: any[]) => any

export default class Registry {
    prefix: string = '!';
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

    //excute on any command type
    global_middlwares: GlobalMiddlwaresType[] = []

    //excute only on slash commands
    global_slash_middlwares: SMiddlwaresType[] = []

    //excute only on message commands
    global_message_middlwares: MMiddlwaresType[] = []

    //excute only on context menus commands
    global_context_middlwares: CxMiddlwaresType[] = []

    //excute only on components interactions
    global_component_middlwares: CpMiddlwaresType[] = []

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
    registerGlobalMiddlware(middlware: GlobalMiddlwaresType) {
        this.global_middlwares.push(middlware)
    }
    registerSlashMiddlwares(middlware: SMiddlwaresType) {
        this.global_slash_middlwares.push(middlware)
    }
    registerMessageMiddlwares(middlware: MMiddlwaresType) {
        this.global_message_middlwares.push(middlware)
    }
    registerContextMiddlwares(middlware: CxMiddlwaresType) {
        this.global_context_middlwares.push(middlware)
    }
    registerComponentMiddlwares(middlware: CpMiddlwaresType) {
        this.global_component_middlwares.push(middlware)
    }
}