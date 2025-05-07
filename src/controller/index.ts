import { FastifyReply, FastifyRequest } from "fastify";
import { SendToAgent, SystemPrompt } from "../service/ExamProcessor";

export const ProcessExam = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { messages } = request.body as {
    messages: [
      {
        content: string;
      }
    ];
  };

  const res = await SendToAgent(messages[0]?.content);

  const response = res.choices[0].message.content;

  reply.send({ response });
};

export const AppConfig = (request: FastifyRequest, reply: FastifyReply) => {
  reply.send({ globalPrompt: SystemPrompt });
};
