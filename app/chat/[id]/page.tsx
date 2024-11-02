"use client";
import { useConversationStore } from "@/app/page";
import { Markdown } from "@/components/markdown";
import { Message } from "@/app/page";
import { useState } from "react";
import { Sparkle } from "lucide-react";

export default function Chat() {
  const {
    conversation,
    question,
    setQuestion,
    setConversation,
    updateLastMessage,
  } = useConversationStore();
  const [isStreaming, setIsStreaming] = useState(false);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() === "" || isStreaming) return;

      const newMessage: Message = { role: "user", content: question };
      setConversation(newMessage);
      setQuestion("");
      setIsStreaming(true);

      try {
        const response = await fetch(`/api/chat`, {
          method: "POST",
          body: JSON.stringify({ conversation: [...conversation, newMessage] }),
        });

        if (!response.ok) throw new Error("API error");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");

        const decoder = new TextDecoder("utf-8");
        let done = false;
        let content = "";

        setConversation({ role: "assistant", content: "" });

        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            content += chunk;
            updateLastMessage(content);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsStreaming(false);
      }
    }
  };

  return (
    <div className="my-4 max-w-2xl text-md flex min-h-screen  mx-auto">
      <div className="flex flex-col gap-4 mb-24">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl ${
              message.role === "user"
                ? "bg-[#21201C] text-neutral-300"
                : "bg-[#343432] text-white"
            }`}
          >
            {message.role === "user" ? (
              <div>
                <div className="flex items-start gap-2">{message.content}</div>
              </div>
            ) : (
              <Markdown>{message.content}</Markdown>
            )}
          </div>
        ))}
      </div>

      <div className="input fixed bottom-0 left-0 right-0 max-w-2xl mx-auto p-4">
        <div className="relative flex items-center">
          <textarea
            autoFocus
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up"
            className="w-full bg-[#393937] border border-neutral-500 rounded-3xl py-4 pl-4 pr-10 font-medium text-sm placeholder-[#A29F97] resize-none outline-none"
            rows={1}
            disabled={isStreaming}
          ></textarea>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={() => handleKeyDown}
            disabled={isStreaming}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
