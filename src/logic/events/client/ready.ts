import { MiddlewareType } from "../../../interfaces/IMiddleware";
import SuperClient from "../../../super_classes/SuperClient";
import { SuperEvent } from "../../../super_classes/SuperEvent";

export default new SuperEvent({
    event: 'ready',
    once: false,
    run: (client: SuperClient) => {
        client.registry.middlewareRunner.execute(client, MiddlewareType.GLOBAL, client);
        console.log(`Logged in as ${client.user?.tag}`)
    }
})