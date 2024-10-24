"use client";

import { useRouter } from "next/navigation";
import { create } from 'zustand'
import React from 'react';
import {  Globe, Sparkles, BookOpen, Settings, Download, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';


  const recentSearches = [
    'Test 1',
    'Test 2',
    'Test 3',
  ];
export type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ConversationStore {
  conversation: Message[];
  setConversation: (newMessage: Message) => void;
  updateLastMessage: (content: string) => void;

  question: string;
  setQuestion: (newQuestion: string) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  conversation: [],
  setConversation: (newMessage: Message) => set((state) => ({
    conversation: [...state.conversation, newMessage]
  })),
  updateLastMessage: (content: string) => set((state) => ({
    conversation: state.conversation.map((msg, index) => 
      index === state.conversation.length - 1 ? { ...msg, content } : msg
    )
  })),

  question: "",
  setQuestion: (newQuestion: string) => set((state) => ({
    question: newQuestion,
  })),
}));

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
    <main>
      
      <div className="fixed left-0 top-0 h-full w-64 bg-[#202222] text-gray-300 flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6" />
        <span className="text-xl font-semibold text-white">Joy</span>
      </div>
      <Link href="/">
        <div className="px-3 py-2">
          <button className="w-full px-3 py-2 flex items-center gap-2 bg-[#1e1f23] hover:bg-[#2a2b30] rounded-lg text-sm">
          <span>New Thread</span>
          <span className="ml-auto text-xs text-gray-500">Ctrl</span>
          <span className="text-xs text-gray-500">I</span>
        </button>
        </div>
      </Link>
      
      <nav className="px-2 py-2">
        <ul className="space-y-1">
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-[#1e1f23]">
              
              Home
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-[#1e1f23]">
              <Globe className="w-4 h-4" />
              Discover
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-[#1e1f23]">
              <BookOpen className="w-4 h-4" />
              Library
            </a>
          </li>
        </ul>
      </nav>

      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {recentSearches.map((search, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[#1e1f23] truncate"
            >
              {search}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-gray-800">
        <div className=" rounded-lg p-4">
          <h3 className="text-white font-medium mb-1">Try Pro</h3>
          <p className="text-sm text-gray-400 mb-3">
            Upgrade for image upload, smarter AI, and more Pro Search.
          </p>
          <button className="flex items-center gap-2 text-sm text-white hover:text-gray-300">
            Learn More
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#1e1f23]">
            <User className="w-5 h-5" />
            <span className="text-sm">syeddhasnai...</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-[#1e1f23]">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[#1e1f23]">
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-[#1e1f23]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            
          </div>
        </div>
      </div>
    </div>
      <div className="search-container flex h-screen flex-col items-center justify-center">
        <div className="max-w-lg w-full rounded-lg bg-[#202222] p-4 border border-neutral-500 shadow-lg">
          <textarea
            autoFocus
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className=" w-full bg-transparent resize-none outline-none"
          ></textarea>
          <div className="text-sm text-gray-400">Attach</div>
        </div>
      </div>

      
    </main>
  );
}
