import SuperClient from "@/super_classes/SuperClient.js";
import { SuperSlashCommand, SuperMessageCommand } from "@/super_classes/SuperCommand.js";
import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export default async function (client: SuperClient) {
  const basePath = client.client_config.location?.base;
  const commandsPath = client.client_config.location?.commands;

  if (!basePath || !commandsPath) throw new Error('Be sure to provide a base path and commands path through the config file');

  const fullBasePath = path.join(basePath, commandsPath);

  for (const type of readdirSync(fullBasePath)) {
    const typePath = path.join(fullBasePath, type);

    for (const dir of readdirSync(typePath)) {
      const dirPath = path.join(typePath, dir);

      for (const file of readdirSync(dirPath).filter(f => f.endsWith('.js'))) {
        console.log(type, dir, file);

        const filePath = path.join(dirPath, file);

        try {
          const module = await import(pathToFileURL(filePath).href);
          if (!module) throw new Error('No module found');
          if (!module.default) throw new Error('No default export found');
          const command = module.default;

          if (type === 'slash') {
            if (!(command instanceof SuperSlashCommand)) continue;
            console.log(`Loaded command: *${command.settings.command.name}* - ${command.settings.command.description}`);
            client.registry.registerSlash(command.settings.command.name, command);
            client.commandsToRegister.push(command.settings.command);
          } else if (type === 'prefix') {
            if (!(command instanceof SuperMessageCommand)) continue;
            console.log(`Loaded prefix command *${command.settings.name}* - ${command.settings.aliases?.join(', ')}`);
            client.registry.registerPrefix(command.settings.name, command, command.settings.aliases);
          } else if (type === 'nonprefix') {
            if (!(command instanceof SuperMessageCommand)) continue;
            console.log(`Loaded non-prefix command *${command.settings.name}* - ${command.settings.aliases?.join(', ')}`);
            client.registry.registerNonPrefix(command.settings.name, command, command.settings.aliases);
          }
        } catch (e) {
          console.error(`Failed to load command at ${filePath}`, e);
          continue;
        }
      }
    }
  }
}
    