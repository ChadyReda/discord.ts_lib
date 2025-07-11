import { readdirSync, statSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import SuperClient from "@/super_classes/SuperClient.js";
import { SuperContext } from "@/super_classes/SuperContext.js";

export default async function (client: SuperClient) {
  const contextsBasePath = client.client_config.location?.context_menus;
  if (!contextsBasePath) throw new Error('Be sure to provide the contexts path in client_config.location.context_menus');

  for (const type of readdirSync(contextsBasePath)) {
    const typePath = path.join(contextsBasePath, type);
    if (!statSync(typePath).isDirectory()) continue;

    for (const file of readdirSync(typePath).filter(f => f.endsWith('.js') || f.endsWith('.ts'))) {
      const filePath = path.join(typePath, file);
      try {
        const module = await import(pathToFileURL(filePath).href);
        if (!module) continue;

        const context = module.default;
        if (!(context instanceof SuperContext)) continue;

        if (type === 'message') {
          console.log(`Loaded context: ${context.settings.command.name}`);
          context.settings.command.setType(3);
          client.commandsToRegister.push(context.settings.command);
          client.registry.registerMessageContext(context.settings.command.name, context);
        } else if (type === 'user') {
          console.log(`Loaded context: ${context.settings.command.name}`);
          context.settings.command.setType(2);
          client.commandsToRegister.push(context.settings.command);
          client.registry.registerUserContext(context.settings.command.name, context);
        }
      } catch (e) {
        console.error(`Failed to load context at ${filePath}`, e);
      }
    }
  }
}
