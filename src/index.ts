import { MiddlewareType } from "./interfaces/IMiddleware";
import SuperClient from "./super_classes/SuperClient";
import { SuperMiddleware } from "./super_classes/SuperMiddleware";
const mycrazybot = new SuperClient()

mycrazybot.registry.middlewareRunner.use(
    new SuperMiddleware({
        type: MiddlewareType.GLOBAL,
        position: 0,
        run: async (client, control, ...args) => {
            console.log('im a global middlware')
            control.next()
        }
    })
)

mycrazybot.registry.middlewareRunner.use(
    new SuperMiddleware({
        type: MiddlewareType.COMPONENT,
        position: 0,
        run: async (client, control, ...args) => {
            console.log('component interaction has been triggerd')
            control.next()
        }
    })
)

mycrazybot.start()
