import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const SYSTEM_PROMPT = `
You are a smart project management AI assistant.
Your job is to understand the user's intent and return ONLY a valid JSON object — no explanations, no markdown, no extra text.

You MUST detect the user's language (Arabic or English) automatically.
You MUST respond in the SAME language as the user — do NOT translate.
All task titles MUST be written in the same language as the user's input.

You MUST return ONLY this JSON structure:
{
  "action": "create_project" | "add_tasks" | "update_progress",
  "projectTitle": "string",
  "tasks": ["task 1", "task 2", ...],
  "progress": number (0-100, optional)
}

Rules:
- "action" is REQUIRED. Choose the most appropriate one based on intent.
- "projectTitle" is REQUIRED. Infer it from the user message.
- "tasks" is REQUIRED for "create_project" and "add_tasks". Generate smart, practical, specific tasks (at least 4-6).
- "progress" is OPTIONAL. Only include it if the user mentions completion percentage.
- Do NOT include any text outside the JSON.
- Do NOT use markdown code blocks.
- Always return parseable, valid JSON.

Examples:
User: "أنشئ مشروع لتعلم React"
Response: {"action":"create_project","projectTitle":"تعلم React","tasks":["تعلم أساسيات JavaScript","إعداد بيئة التطوير","تعلم مكونات React","تعلم إدارة الحالة","بناء مشروع تطبيقي","نشر المشروع"],"progress":0}

User: "Create a portfolio project and I already finished 30%"
Response: {"action":"create_project","projectTitle":"Portfolio Project","tasks":["Plan the site structure","Design the color scheme","Build the Hero section","Build the Projects section","Build the Contact section","Deploy to Vercel"],"progress":30}
`.trim();

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message.trim() },
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // Strip any accidental markdown fences
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!parsed.action || !parsed.projectTitle) {
      return NextResponse.json(
        { error: "AI response missing required fields", raw },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[/api/ai] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
