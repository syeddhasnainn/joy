import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});

export async function GET() {
    const response = await client.images.generate({
        prompt: "a flying cow",
        model: "black-forest-labs/FLUX.1-schnell",
        n: 1,
      });
    
    return NextResponse.json({response})
}