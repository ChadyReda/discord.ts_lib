import { MiddlewareType } from "../../interfaces/IMiddleware";
import { SuperMiddleware } from "../../super_classes/SuperMiddleware";

export default new SuperMiddleware({
    type: MiddlewareType.CONTEXT,
    position: 0,
    run: async (client, control, ...args) => {
        console.log('a context command has been runned')
    }
})