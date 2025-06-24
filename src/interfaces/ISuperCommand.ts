import { Interaction, Message, TextChannel, PermissionsString, SlashCommandBuilder } from "discord.js";
import SuperClient from "../super_classes/SuperClient";

type RunSlashFunc = (client: SuperClient, interaction: Interaction) => Promise<void>;
type RunMessageFunc = (client: SuperClient, message: Message & {channel: TextChannel}, args: any[]) => Promise<void>;

interface ISuperSlashCommand {
    command: SlashCommandBuilder,
    botPermissions: PermissionsString[],
    developerOnly: boolean,
    cooldown: number,
    run: RunSlashFunc
}

interface ISuperMessageCommand {
    name: string,
    userPermissions: PermissionsString[],
    botPermissions: PermissionsString[],
    aliases: string[],
    developerOnly: boolean,
    cooldown: number,
    run: RunMessageFunc
}

export {
    ISuperSlashCommand,
    ISuperMessageCommand,
    RunSlashFunc,
    RunMessageFunc
}