import { ClientEvents } from "discord.js";
import SuperClient from "../super_classes/SuperClient";

type RunFunc = (client: SuperClient, ...args: any[]) => Promise<void> | any;

interface ISuperEvent {
    event: keyof ClientEvents;
    once: boolean;
    run: RunFunc
}

export {
    ISuperEvent,
    RunFunc
}