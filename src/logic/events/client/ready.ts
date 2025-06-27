import SuperClient from "../../../super_classes/SuperClient";
import { SuperEvent } from "../../../super_classes/SuperEvent";

export default new SuperEvent({
    event: 'ready',
    once: false,
    run: (client: SuperClient) => {
        console.log(`Logged in as ${client.user?.tag}`)
    }
})
