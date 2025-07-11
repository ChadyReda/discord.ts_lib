import SuperClient from "@/super_classes/SuperClient.js";
import { readdirSync, statSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { SuperMiddleware } from "@/super_classes/SuperMiddleware.js";

export default async function(client: SuperClient) {
  const middlewaresBasePath = client.client_config.location?.middlewares;
  if (!middlewaresBasePath) throw new Error('Be sure to provide the middlewares path in client_config.location.middlewares');

  if (!statSync(middlewaresBasePath).isDirectory()) return;

  for (const file of readdirSync(middlewaresBasePath).filter(f => f.endsWith('.js') || f.endsWith('.ts'))) {
    const filePath = path.join(middlewaresBasePath, file);
    try {
      const module = await import(pathToFileURL(filePath).href);
      if (!module) continue;

      const middleware = module.default;
      if (!(middleware instanceof SuperMiddleware)) continue;

      client.registry.middlewareRunner.use(middleware);
      console.log(`Global Middleware *${file.replace(/\.(ts|js)$/, '')}* is Loaded successfully`);
    } catch (e) {
      console.error(`Failed to load middleware at ${filePath}`, e);
    }
  }
}
