import {readdirSync} from 'fs'
import SuperClient from "../super_classes/SuperClient";
import SuperComponent from '../super_classes/SuperComponent';

export default async function (client: SuperClient) {
    for (const type of readdirSync('./src/logic/components')) {
        for (const file of readdirSync(`./src/logic/components/${type}`).filter(f => f.endsWith('.ts'))){
            const module = await import(`../logic/components/${type}/${file}`);
            if (!module) continue;
            const component = module.default;
            if (!(component instanceof SuperComponent)) continue;
            if (type == 'buttons') {
                console.log(`Loaded button component: *${component.settings.id}*`)
                client.registry.registerButton(component.settings.id, component)
            }else if (type == 'modals') {
                console.log(`Loaded modal component: *${component.settings.id}*`)
                client.registry.registerModal(component.settings.id, component)
            }else if (type == 'selects') {
                console.log(`Loaded selcect component: *${component.settings.id}*`)
                client.registry.registerSelect(component.settings.id, component)
            }
        }
    }
}