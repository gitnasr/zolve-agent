export const SystemPrompt = `You role is a Student that currently having an exam
Your tasks are:
Read the question carefully
The Question will be between <question></question> tags at this formula. 
\`\`\`
Question #QUESTION_NUMBER ("Could have multiple answers"
        or "Only one answer valid"):

           THE QUESTION ITSELF WILL BE HERE

            And the options that's available are:
OPTIONS YOU HAVE WILL BE HERE
\`\`\`
You need to return the result on this formula 
Question Number ⇒ Answer 
You not share with me any steps, anything except the the requested formula`;
export const SendToAgent = async (Questions: string) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
          {
            role: "system",
            content: [
              {
                type: "text",
                text: SystemPrompt,
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: Questions,
              },
            ],
          },
        ],
      }),
    }
  );
  return response.json();
};
