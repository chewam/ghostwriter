import OpenAI from "openai";
// import puppeteer from "puppeteer";
import { OpenAIStream, StreamingTextResponse } from "ai";
import type { ChatCompletionCreateParams } from "openai/resources/chat/index";
// import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from "node-html-markdown";

// const SYSTEM_PROMPT = `Assist the user in creating a compelling CV! Provide guidance, suggestions, and content recommendations to craft an outstanding resume that highlights the user's skills, experiences, and qualifications.

// Additionally, please follow these rules:

// 1. You have access to a tool to fetch the user's LinkedIn profile based on their LinkedIn login.
// 2. You must ask the user for their login information to fetch the LinkedIn profile and gather all relevant information about their professional background and experiences.
// 3. You must also gather any other relevant information that would help in writing the user's CV, such as their education history, skills, certifications, and career objectives.
// 4. You must use the Markdown format where relevant to structure and format the CV appropriately.

// Please proceed with the LinkedIn login and any other information the user would like to share to get started with creating their CV.`;

const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "get_linkedin_profile",
    description: "Look for LinkedIn profile by login in Markdown format.",
    parameters: {
      type: "object",
      properties: {
        login: {
          type: "string",
          description: "The use LinkedIn login",
        },
      },
      required: ["login"],
    },
  },
];

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// async function getLinkedinProfile(login: string) {
//   const url = `https://fr.linkedin.com/in/${login}`;
//   console.log("URL:", url);
//   const browser = await puppeteer.launch({ headless: "new" });
//   const page = await browser.newPage();
//   await page.goto(url, { waitUntil: "networkidle2" });
//   const element = await page.waitForSelector(".profile");
//   const value = await element?.evaluate((el) => el.textContent);
//   console.log("VALUE:", value);
//   // const markdown = NodeHtmlMarkdown.translate(value || "");
//   // console.log("MARKDOWN:", markdown);
//   await browser.close();
//   // return markdown;
//   return value;
// }

export async function POST(req: Request) {
  const { messages } = await req.json();

  // if (messages.length < 2) {
  //   messages.push({ role: "system", content: SYSTEM_PROMPT });
  // }
  console.log("MESSAGES 1:", messages);

  const response = await openai.chat.completions.create({
    messages,
    // functions,
    stream: true,
    temperature: 0.1,
    model: "gpt-3.5-turbo",
    // model: "gpt-3.5-turbo-0613",
  });

  // const stream = OpenAIStream(response, {
  //   experimental_onFunctionCall: async (
  //     { name, arguments: args },
  //     createFunctionCallMessages,
  //   ) => {
  //     if (name === "get_linkedin_profile") {
  //       const content = await getLinkedinProfile(args.login as string);

  //       const newMessages = [
  //         { role: "function", name: "get_linkedin_profile", content },
  //       ];
  //       console.log("MESSAGES 2:", [...messages, ...newMessages]);
  //       return openai.chat.completions.create({
  //         messages: [...messages, ...newMessages],
  //         stream: true,
  //         model: "gpt-3.5-turbo-0613",
  //         // see "Recursive Function Calls" below
  //         // functions,
  //       });
  //     }
  //   },
  // });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
