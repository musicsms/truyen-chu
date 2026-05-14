import { buildApiGatewayApp } from "./app.js";

const port = Number(process.env.API_GATEWAY_PORT ?? "3000");
const host = process.env.HOST ?? "0.0.0.0";
const contentServiceUrl = process.env.CONTENT_SERVICE_URL ?? "http://localhost:3001";

const app = await buildApiGatewayApp({ contentServiceUrl });
await app.listen({ port, host });
