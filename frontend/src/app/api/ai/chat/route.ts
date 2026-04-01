import { NextResponse } from "next/server"
import { chatWithAI, type ChatContext } from "@/lib/ai/groq-client"

/**
 * POST /api/ai/chat
 * Chat with Mindy AI about your portfolio
 * Supports streaming responses
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { question, context } = body as {
      question: string
      context: ChatContext
    }
    
    if (!question || !context) {
      return NextResponse.json(
        { error: "Missing question or context" },
        { status: 400 }
      )
    }
    
    // Create a ReadableStream for streaming response
    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatWithAI(question, context)) {
            controller.enqueue(encoder.encode(JSON.stringify({ content: chunk }) + "\n"))
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })
    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Failed to process chat", message: String(error) },
      { status: 500 }
    )
  }
}
