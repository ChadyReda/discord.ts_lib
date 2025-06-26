import SuperClient from "../super_classes/SuperClient"
enum MiddlewareType {
    GLOBAL = 'global',
    CONTEXT = 'context',
    SLASH = 'slash',
    MESSAGE = 'message'
}
type MiddlewareExec = (client: SuperClient, ...args: any[]) => Promise<void> | any
interface ISuperMiddlware {
    type: MiddlewareType,
    enabled?: boolean,
    run: MiddlewareExec
}
export {
    MiddlewareType,
    ISuperMiddlware,
    MiddlewareExec
}