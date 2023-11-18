"use client"

import Image from "next/image"
import { useChat } from "ai/react"
import remarkGfm from "remark-gfm"
import ReactMarkdown from "react-markdown"
import { useEffect, useRef, useState } from "react"
import ReactCodeMirror from "@uiw/react-codemirror"
import { languages } from "@codemirror/language-data"
// import { githubDark } from "@uiw/codemirror-theme-github"
// import { materialLight } from "@uiw/codemirror-theme-material"
import { duotoneLight } from "@uiw/codemirror-theme-duotone"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"

import useDebounce from "@/lib/use-debounce"
import spinner from "@/app/spinner.svg"

const DEBOUNCE_DELAY = 5000

const SYSTEM_PROMPT = `You are an assistant in charge of helping the user to write a text.
The text could be a story, a novel, a list of items to buy at the supermarket or the user's CV.
Do your best to bring the relevant improvements and corrections to the user's text.
Use Markdown to format your answers.
Start by welcoming the user and tell him that you will start your job as soon as he starts writting text.
`

export default function Page() {
  const [value, setValue] = useState("")
  const { messages, append, isLoading } = useChat()
  const isStarting = useRef(false)
  const debouncedValue = useDebounce(value, DEBOUNCE_DELAY)

  const appendRef = useRef(append)

  useEffect(() => {
    async function sendMessage() {
      console.log("appel à appendRef.current()")
      await appendRef.current({ content: debouncedValue, role: "user" })
    }
    if (debouncedValue && debouncedValue.length) {
      sendMessage()
    }
  }, [debouncedValue])

  useEffect(() => {
    async function startConversation() {
      console.log("start conversation")
      await appendRef.current({ content: SYSTEM_PROMPT, role: "system" })
    }
    if (!isStarting.current) {
      startConversation()
    }
    return () => {
      isStarting.current = true
    }
  }, [])

  function handleChange(value: string) {
    const message = `Here is my text:
---
${value}
    `
    setValue(message)
  }

  return (
    <div className="page flex flex-1 p-12 gap-12 overflow-y-auto">
      <ReactCodeMirror
        value={value}
        height="100%"
        autoFocus={true}
        // theme={githubDark}
        // theme={materialLight}
        theme={duotoneLight}
        className="flex-1 shadow overflow-auto relative"
        onChange={(value) => setValue(value)}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
      />
      <div className="flex-1 relative overflow-y-auto">
        {messages.map((m, i) =>
          m.role === "assistant" && i === messages.length - 1 ? (
            <div key={m.id}>
              <ReactMarkdown
                className="markdown-body"
                remarkPlugins={[remarkGfm]}
              >
                {m.content}
              </ReactMarkdown>
            </div>
          ) : null,
        )}
        <div
          className={`animate-spin absolute bottom-0 right-0 ${
            isLoading ? "" : "hidden"
          }`}
        >
          <Image width={32} height={32} alt="spinner" src={spinner} />
        </div>
      </div>
    </div>
  )
}
