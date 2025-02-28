import cors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastify from "fastify";
import routes from "./router";

const server = fastify({
  logger: true,
});
server.register(cors, {
  allowedHeaders: ["Content-Type", "Authorization"],
  origin: "*",
});
server.register(routes);
server.register(fastifyEnv, {
  schema: {
    type: "object",
    required: ["PORT", "OPEN_ROUTER_API_KEY"],
    properties: {
      PORT: {
        type: "string",
        default: "3000",
      },
      OPEN_ROUTER_API_KEY: {
        type: "string",
      },
    },
  },
  dotenv: true,
});
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

server.listen(
  { port: Number(process.env.PORT) || 3000, host },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
