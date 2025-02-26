import { FastifyReply, FastifyRequest } from "fastify";

import { SendToAgent } from "../service/ExamProcessor";

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
  console.log(res);

  const response = res.choices[0].message.content;

  reply.send({ response });
};
