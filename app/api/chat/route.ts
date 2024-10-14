import { NextResponse, NextRequest } from "next/server";
import Together from "together-ai";
import { OpenAI } from "openai";

const together = new Together({
    apiKey: process.env["TOGETHER_API_KEY"],
});

const client = new OpenAI({
    apiKey: process.env.TOGETHER_API_KEY,
    baseURL: "https://api.together.xyz/v1",
  });

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const message = Object.entries(messages).pop();
        if (!message) {
            return NextResponse.json({ error: "No message found" }, { status: 400 });
        }
        
        if (message[1].content.startsWith("/image")) {
            const response = await client.images.generate({
                prompt: message[1].content,
                model: "black-forest-labs/FLUX.1-schnell-Free",
                n: 1,
              });

            console.log('response:',response)
        
            return NextResponse.json({response})
        }

        else {
            const stream = await together.chat.completions.create({
                model: 'meta-llama/Llama-3-8b-chat-hf',
                messages: messages,
                stream: true,
            });
    
            const readableStream = new ReadableStream({
                async start(controller) {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        controller.enqueue(content);
                    }
                    controller.close();
                },
            });
    
            return new Response(readableStream, {
                headers: {
                    'Content-Type': 'text/plain',
                    'Transfer-Encoding': 'chunked',
                },
            });
        }
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
