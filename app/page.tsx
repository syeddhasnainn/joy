"use client";

import { useRouter } from "next/navigation";
import React from 'react';
import { useConversationStore } from './store/conversation';
import type { Message } from './store/conversation';

const recentSearches = [
  'Test 1',
  'Test 2',
  'Test 3',
];

export default function Home() {
  const router = useRouter();
  const { conversation, setConversation, question, setQuestion } = useConversationStore();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const uuid = crypto.randomUUID();
      router.push(`/chat/${uuid}`); 

      if (question.trim() === "") return;
      
      const newMessage: Message = { role: "user", content: question };
      setConversation(newMessage);
      setQuestion("");

      try {
        const response = await fetch(`/api/chat`, {
          method: "POST",
          body: JSON.stringify({ conversation: [...conversation, newMessage] }), 
        });

        if (!response.ok) throw new Error("api error");

        const responseText = await response.text();

        setConversation({ role: "assistant", content: responseText });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <main className="flex min-h-screen">
      <div className="search-container flex h-screen flex-col items-center justify-center w-full">
        <div className="max-w-3xl w-full rounded-lg bg-[#393937] text-[#A6A39A] p-4 border border-neutral-500 shadow-lg">
          <textarea
            autoFocus
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="w-full bg-transparent resize-none outline-none"
          ></textarea>
          <div className="text-sm text-gray-400">Attach</div>
        </div>
      </div>
    </main>
  );
}
