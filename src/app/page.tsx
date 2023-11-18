"use client"

import Image from "next/image"
import { useChat } from "ai/react"
import remarkGfm from "remark-gfm"
import ReactMarkdown from "react-markdown"
import { useEffect, useRef, useState } from "react"
import ReactCodeMirror from "@uiw/react-codemirror"
import { languages } from "@codemirror/language-data"
import { githubDark } from "@uiw/codemirror-theme-github"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"

import useDebounce from "@/lib/use-debounce"
import spinner from "@/app/spinner.svg"

const DEBOUNCE_DELAY = 5000

export default function Page() {
  const [value, setValue] = useState("")
  const { messages, append, isLoading } = useChat()
  const debouncedValue = useDebounce(value, DEBOUNCE_DELAY)

  const appendRef = useRef(append)

  useEffect(() => {
    async function sendMessage() {
      console.log("appel à appendRef.current()")
      await appendRef.current({ content: debouncedValue, role: "user" })
    }
    if (debouncedValue && debouncedValue.length) {
      console.log("debouncedValue has changed:", debouncedValue)
      sendMessage()
    }
  }, [debouncedValue, appendRef])

  useEffect(() => {
    console.log("messages have changed:", messages.length, messages)
  }, [messages])

  return (
    <div className="page flex flex-1 p-12 gap-12">
      <ReactCodeMirror
        value={value}
        height="100%"
        theme={githubDark}
        className="flex-1 shadow"
        onChange={(value) => setValue(value)}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
      />
      <div className="flex-1 relative">
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
