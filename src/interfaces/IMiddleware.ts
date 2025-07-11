import { MiddlewareControl } from "@/super_classes/MiddlewareRunner.js"
import SuperClient from "@/super_classes/SuperClient.js"

enum MiddlewareType {
    GLOBAL = 'global',
    CONTEXT = 'context',
    SLASH = 'slash',
    MESSAGE = 'message',
    COMPONENT = 'component'
}

type MiddlewareRun = (client: SuperClient, control: MiddlewareControl, ...args: any[]) => Promise<void> | any

interface ISuperMiddlware {
    type: MiddlewareType,
    enabled?: boolean,
    position: number,
    run: MiddlewareRun
}

export {
    MiddlewareType,
    ISuperMiddlware,
    MiddlewareRun
}