import { MiddlewareType } from "@/interfaces/IMiddleware.js";
import { SuperMiddleware } from "@/super_classes/SuperMiddleware.js";
import SuperClient from "@/super_classes/SuperClient.js";

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
  private settings: {
    global: SuperMiddleware[];
    slash: SuperMiddleware[];
    message: SuperMiddleware[];
    context: SuperMiddleware[];
    component: SuperMiddleware[];
  } = {
    global: [],
    slash: [],
    message: [],
    context: [],
    component: [],
  };

  private registredPositions: {
    global: Set<number>;
    slash: Set<number>;
    message: Set<number>;
    context: Set<number>;
    component: Set<number>;
  } = {
    global: new Set<number>(),
    slash: new Set<number>(),
    message: new Set<number>(),
    context: new Set<number>(),
    component: new Set<number>(),
  };

  use(middleware: SuperMiddleware) {
    const type = middleware.settings.type as keyof typeof this.settings;
    const position = middleware.settings.position;

    if (this.registredPositions[type].has(position)) {
      throw new Error(`Middleware with position ${position} is already registered`);
    }

    this.registredPositions[type].add(position);
    this.settings[type].push(middleware);
    this.settings[type].sort(
      (a: SuperMiddleware, b: SuperMiddleware) =>
        a.settings.position - b.settings.position
    );
  }

  async execute(client: SuperClient, type: MiddlewareType, ...args: any[]) {
    const category = type as keyof typeof this.settings;
    const middlewares = this.settings[category] || [];
    let index = 0;

    const runner = async (): Promise<void> => {
      if (index >= middlewares.length) return;

      const current = middlewares[index++];
      if (!current?.settings.enabled) return await runner();

      const control = new MiddlewareControl(runner);
      await current.execute(client, control, ...args);
    };

    await runner();
  }
}
