import { readdirSync, statSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import SuperClient from "@/super_classes/SuperClient.js";
import { SuperComponent} from '@/super_classes/SuperComponent.js';

export default async function (client: SuperClient) {
  const componentsBasePath = client.client_config.location?.components;
  if (!componentsBasePath) throw new Error('Be sure to provide the components path in client_config.location.components');

  for (const type of readdirSync(componentsBasePath)) {
    const typePath = path.join(componentsBasePath, type);
    if (!statSync(typePath).isDirectory()) continue;

    for (const file of readdirSync(typePath).filter(f => f.endsWith('.js') || f.endsWith('.ts'))) {
      const filePath = path.join(typePath, file);
      try {
        const module = await import(pathToFileURL(filePath).href);
        if (!module) continue;

        const component = module.default;
        if (!(component instanceof SuperComponent)) continue;

        if (type === 'buttons') {
          console.log(`Loaded button component: *${component.settings.id}*`);
          client.registry.registerButton(component.settings.id, component);
        } else if (type === 'modals') {
          console.log(`Loaded modal component: *${component.settings.id}*`);
          client.registry.registerModal(component.settings.id, component);
        } else if (type === 'selects') {
          console.log(`Loaded select component: *${component.settings.id}*`);
          client.registry.registerSelect(component.settings.id, component);
        }
      } catch (e) {
        console.error(`Failed to load component at ${filePath}`, e);
      }
    }
  }
}
