import SuperClient from "../super_classes/SuperClient";
import { SuperSlashCommand, SuperMessageCommand } from "../super_classes/SuperCommand";
import { readdirSync } from 'fs'

export default async function (client: SuperClient) {
    for (const type of readdirSync('./src/logic/commands/')) {
        for (const dir of readdirSync(`./src/logic/commands/${type}`)) {
            for (const file of readdirSync(`./src/logic/commands/${type}/${dir}`).filter(f => f.endsWith('.ts'))) {
                const module = await import(`../logic/commands/${type}/${dir}/${file}`);
                if (!module) continue;
                const command = module.default;
                if (type == 'slash') {
                    if (!(command instanceof SuperSlashCommand)) continue;
                    console.log(`Loaded command: *${command.settings.command.name}* - ${command.settings.command.description}`)
                    client.registry.registerSlash(command.settings.command.name, command)
                    client.commandsToRegister.push(command.settings.command)
                }else if (type == 'prefix') {
                    if (!(command instanceof SuperMessageCommand)) continue;
                    console.log(`Loaded prefix command *${command.settings.name}* - ${command.settings.aliases?.join(', ')}`)
                    client.registry.registerPrefix(command.settings.name, command, command.settings.aliases)
                }else if (type == 'nonprefix') {
                    if (!(command instanceof SuperMessageCommand)) continue;
                    console.log(`Loaded non-prefix command *${command.settings.name}* - ${command.settings.aliases?.join(', ')}`)
                    client.registry.registerNonPrefix(command.settings.name, command, command.settings.aliases)
                }
            }
        }
    }
}