import { Message, TextChannel, PermissionsString, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import SuperClient from "../super_classes/SuperClient";

type RunSlashFunc = (client: SuperClient, interaction: ChatInputCommandInteraction) => Promise<void> | any;
type RunMessageFunc = (client: SuperClient, message: Message & {channel: TextChannel}, args: any[]) => Promise<void> | any;

interface ISuperSlashCommand {
    command: SlashCommandBuilder,
    botPermissions: PermissionsString[],
    userPermissions: PermissionsString[],
    developerOnly: boolean,
    cooldown: number,
    run: RunSlashFunc
}

interface ISuperMessageCommand {
    name: string,
    userPermissions: PermissionsString[],
    botPermissions: PermissionsString[],
    aliases: string[],
    nsfw: boolean
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