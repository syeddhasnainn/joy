"use client";

import { Markdown } from "@/components/markdown";
import Spinner from "@/components/spinner";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [image, setImage] = useState<"">("")
  const handleSubmit = async (question: string) => {
    const userMessage = {role: "user", content: question}
    setIsLoading(true);
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setStreamingContent("");

    try {
      if (question.startsWith("/image")) {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        });

        const data = await response.json();
        const imageUrl = data.response.data[0]?.url;
        setImage(imageUrl);
        return;
      }

      else {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Response body is not readable");
        }
  
        let fullContent = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = new TextDecoder().decode(value);
          fullContent += text;
          setStreamingContent(fullContent);
        }
  
        setMessages(prevMessages => [
          ...prevMessages,
          { role: "assistant", content: fullContent }
        ]);
      }
      
    } catch (error) {
      console.error("Error:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: "assistant", content: "An error occurred while processing your request." }
      ]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const question = e.currentTarget.value.trim();
      if (question && !isLoading) {
        handleSubmit(question);
        e.currentTarget.value = '';
      }
    }
  }

  return (
    <main className="flex flex-col min-h-screen justify-between items-center max-w-xl mx-auto p-4">
      
      <div className="w-full overflow-y-auto mb-4">
        {!messages.length && (
          <div className="text-center text-gray-500 mt-8">joy.</div>
        )}
        {messages.map((message, index) => (
          <div 
            key={index} 
            className="flex items-start gap-2 mb-4"
          >
            <div className="flex-shrink-0 w-6 h-6">
              {message.role === "user" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z"></path></svg>
              )}
            </div>
            <div className="flex-grow">
            {message.role === "assistant" ? <Markdown>{message.content}</Markdown> : message.content}
              
            </div>
          </div>
        ))}

        {image && <div>
          <img src={image} alt="" />
        </div>}
        
        {streamingContent && (
          <div className="flex items-start gap-2 mb-2">
            <div className="flex-shrink-0 w-6 h-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffffff" viewBox="0 0 256 256"><path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48Zm16,144a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V80A16,16,0,0,1,56,64H200a16,16,0,0,1,16,16Zm-52-56H92a28,28,0,0,0,0,56h72a28,28,0,0,0,0-56Zm-24,16v24H116V152ZM80,164a12,12,0,0,1,12-12h8v24H92A12,12,0,0,1,80,164Zm84,12h-8V152h8a12,12,0,0,1,0,24ZM72,108a12,12,0,1,1,12,12A12,12,0,0,1,72,108Zm88,0a12,12,0,1,1,12,12A12,12,0,0,1,160,108Z"></path></svg>
            </div>
            <div className="flex-grow">
              <Markdown>{streamingContent}</Markdown>
            </div>
          </div>
        )}
      </div>
      <div className="fixed bottom-0 max-w-xl w-full">
      <div className="w-full relative ">
        <textarea
          name="question"
          placeholder="Ask a question"
          className="w-full h-24 bg-[#27272A] rounded-md p-2"
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div className="absolute bottom-0 left-0 text-slate-400 p-2 mb-2">Llama 3.2 3B Instruct Turbo</div>
      </div>
      </div>
      

      
    </main>
  );
}