import { ClientEvents } from "discord.js";
import { RunFunc, ISuperEvent } from "../interfaces/ISuperEvent.js";

export class SuperEvent {
    settings: ISuperEvent
    constructor(options: ISuperEvent) {
        this.settings = options
    }
    setEvent(event: keyof ClientEvents) {
        this.settings.event = event
    }
    setOnce(once: boolean) {
        this.settings.once = once
    }
    setRun(run: RunFunc) {
        this.settings.run = run
    }
}