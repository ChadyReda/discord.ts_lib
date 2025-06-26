import { ISuperMiddlware, MiddlewareExec, MiddlewareType } from "../interfaces/IMiddleware";

export class SuperMiddleware {
    settings: ISuperMiddlware
    constructor(options: ISuperMiddlware) {
        this.settings = {enabled: true, ...options};
    }
    setType(type: MiddlewareType) {
        this.settings.type = type
    }
    setRun(run: MiddlewareExec) {
        this.settings.run = run
    }
    setEnabled(enabled: boolean) {
        this.settings.enabled = enabled
    }
}