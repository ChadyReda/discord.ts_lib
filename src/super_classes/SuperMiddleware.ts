import { ISuperMiddlware, MiddlewareRun, MiddlewareType } from "../interfaces/IMiddleware.js";
import { MiddlewareControl } from "./MiddlewareRunner.js";
import SuperClient from "./SuperClient.js";

export class SuperMiddleware {
    settings: ISuperMiddlware
    constructor(options: ISuperMiddlware) {
        this.settings = {enabled: true, ...options};
    }
    setType(type: MiddlewareType) {
        this.settings.type = type
    }
    setEnabled(enabled: boolean) {
        this.settings.enabled = enabled
    }
    setPosition(position: number) {
        this.settings.position = position
    }
    setRun(run: MiddlewareRun) {
        this.settings.run = run
    }

    async execute(client: SuperClient, control: MiddlewareControl, ...args: any[]) {
        if (!this.settings.enabled) return
        await this.settings.run(client, control, ...args)
    }
}