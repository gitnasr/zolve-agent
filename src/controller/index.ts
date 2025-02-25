import { FastifyReply, FastifyRequest } from "fastify";

export const ProcessExam = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.send(request.body);
};
