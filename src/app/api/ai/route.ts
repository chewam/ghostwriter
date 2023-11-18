import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { messages } = await req.json()

  console.log("MESSAGES 1:", messages)

  const response = await openai.chat.completions.create({
    messages,
    stream: true,
    temperature: 0.1,
    model: "gpt-3.5-turbo",
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
