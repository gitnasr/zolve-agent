import { AppConfig, ProcessExam } from "../controller";

import { FastifyInstance } from "fastify";

async function AppRouter(fastify: FastifyInstance) {
  fastify.post("/process", ProcessExam);
  fastify.get("/config", AppConfig);
}

export default AppRouter;
