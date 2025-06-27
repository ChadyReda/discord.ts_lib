import { MiddlewareType, MiddlewareRun } from "../interfaces/IMiddleware";
import { SuperMiddleware } from "./SuperMiddleware";
import SuperClient from "./SuperClient";

export class MiddlewareControl {
    private nextFn: () => Promise<void>;
    private blocked: boolean = false;
    constructor(nextFn: () => Promise<void>) {
        this.nextFn = nextFn;
    }
    block() {
        this.blocked = true;
    }
    get isBlocked() {
        return this.blocked;
    }
    async next() {
        if (!this.blocked) {
            await this.nextFn();
        }
    }
    async continue() {
        await this.next(); // same behavior — semantic sugar
    }
}

export class MiddlewareRunner {
    private settings: { global: SuperMiddleware[], slash: SuperMiddleware[], message: SuperMiddleware[], context: SuperMiddleware[], component: SuperMiddleware[] } = { global: [], slash: [], message: [], context: [], component: [] };
    private registredPositions = {
        global: new Set<number>(),
        slash: new Set<number>(),
        message: new Set<number>(),
        context: new Set<number>(),
        component: new Set<number>(),
    }

    use(middlware: SuperMiddleware) {
        const type = middlware.settings.type;
        const position = middlware.settings.position;
        if (this.registredPositions[type].has(position)) {
            throw new Error(`Middleware with position ${position} is already registred`);
        }
        this.registredPositions[type].add(position);
        this.settings[type].push(middlware)
        this.settings[type].sort((a: any, b: any) => a.settings.position - b.settings.position)
    }
    async execute (client: SuperClient, type: MiddlewareType, ...args: any[]) {
        const middlewares = this.settings[type] || [];
        let index = 0;

        const runner = async (): Promise<void> => {
            if (index >= middlewares.length) return;

            const current = middlewares[index++];
            if (!current.settings.enabled) return await runner();

            const control = new MiddlewareControl(runner);
            await current.execute(client, control, ...args);

        };

        await runner();
    }
}