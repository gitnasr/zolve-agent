import { FastifyInstance } from "fastify";
import { ProcessExam } from "../controller";

async function AppRouter(fastify: FastifyInstance) {
  fastify.post("/process", ProcessExam);
}

export default AppRouter;
