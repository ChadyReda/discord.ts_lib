import { Message, TextChannel, PermissionsString, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import SuperClient from "../super_classes/SuperClient";

type RunSlashFunc = (client: SuperClient, interaction: ChatInputCommandInteraction) => Promise<void> | any;
type RunMessageFunc = (client: SuperClient, message: Message & {channel: TextChannel}, args: any[]) => any;
type SMiddlwaresType = (client: SuperClient, interaction: ChatInputCommandInteraction, args: any[]) => any;
type MMiddlwaresType = (client: SuperClient, message: Message & {channel: TextChannel}, args: any[]) => any;
type OnSFailType = (client: SuperClient, interaction: ChatInputCommandInteraction) => any
type OnMFailType = (client: SuperClient, message: Message & {channel: TextChannel}) => any

interface ISuperSlashCommand {
    command: SlashCommandBuilder,
    botPermissions?: PermissionsString[],
    userPermissions?: PermissionsString[],
    onUserPermissionsFail?: OnSFailType,
    onBotPermissionsFail?: OnSFailType,
    onDeveloperOnlyFail?: OnSFailType,
    onCooldownFail?: OnSFailType,
    middlwares?: SMiddlwaresType[],
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
    middlwares?: MMiddlwaresType[],
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
    SMiddlwaresType,
    MMiddlwaresType,
    OnSFailType,
    OnMFailType
}