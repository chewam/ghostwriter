// gary-van-woerkens-5971b027
"use client";

import remarkGfm from "remark-gfm";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="container m-auto">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`py-3 px-2 mt-3 border-l-4 ${
            m.role === "user"
              ? "border-l-pink-100 bg-gray-100"
              : "border-l-blue-100"
          }`}
        >
          <div className="markdown-body">
            <ReactMarkdown
              // children={m.content}
              remarkPlugins={[remarkGfm]}
              // components={{
              //   code({ node, inline, className, children, ...props }) {
              //     const match = /language-(\w+)/.exec(className || "");
              //     return !inline && match ? (
              //       <SyntaxHighlighter
              //         {...props}
              //         children={String(children).replace(/\n$/, "")}
              //         style={tomorrowNight}
              //         language={match[1]}
              //         PreTag="div"
              //       />
              //     ) : (
              //       <code {...props} className={className}>
              //         {children}
              //       </code>
              //     );
              //   },
              // }}
            >
              {m.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex mt-3">
        <label className="flex-1 mr-3">
          <input
            value={input}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </label>
        <button type="submit" className="bg-gray-100 p-2">
          Send
        </button>
      </form>
    </div>
  );
}
