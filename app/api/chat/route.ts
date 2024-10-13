import { NextResponse, NextRequest } from "next/server";
import Together from "together-ai";

const together = new Together({
    apiKey: process.env["TOGETHER_API_KEY"],
});

export async function POST(req: NextRequest) {
    try {
        const { question } = await req.json();

        const stream = await together.chat.completions.create({
            model: 'meta-llama/Llama-3-8b-chat-hf',
            messages: [
              { role: 'user', content: question },
            ],
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

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
