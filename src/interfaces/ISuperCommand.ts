import { Message, TextChannel, PermissionsString, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import SuperClient from "@/super_classes/SuperClient.js";

type RunSlashFunc = (client: SuperClient, interaction: ChatInputCommandInteraction) => Promise<void> | any;
type RunMessageFunc = (client: SuperClient, message: Message & {channel: TextChannel}, args: any[]) => any;
type OnSFailType = (client: SuperClient, interaction: ChatInputCommandInteraction, ...args: any[]) => any
type OnMFailType = (client: SuperClient, message: Message & {channel: TextChannel}, ...args: any[]) => any

interface ISuperSlashCommand {
    command: SlashCommandBuilder,
    botPermissions?: PermissionsString[],
    userPermissions?: PermissionsString[],
    onUserPermissionsFail?: OnSFailType,
    onBotPermissionsFail?: OnSFailType,
    onDeveloperOnlyFail?: OnSFailType,
    onCooldownFail?: OnSFailType,
    onNsfwFail?: OnSFailType,
    nsfw?: boolean
    developerOnly?: boolean,
    cooldown?: number,
    run: RunSlashFunc
}

interface ISuperMessageCommand {
    name: string,
    userPermissions?: PermissionsString[],
    botPermissions?: PermissionsString[],
    onUserPermissionsFail?: OnMFailType,
    onBotPermissionsFail?: OnMFailType,
    onDeveloperOnlyFail?: OnMFailType,
    onCooldownFail?: OnMFailType,
    onNsfwFail?: OnMFailType,
    aliases?: string[],
    nsfw?: boolean
    developerOnly?: boolean,
    cooldown?: number,
    run: RunMessageFunc
}

export {
    ISuperSlashCommand,
    ISuperMessageCommand,
    RunSlashFunc,
    RunMessageFunc,
    OnSFailType,
    OnMFailType
}