import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getMetaKey() {
  try {
    const p = path.join(process.env.HOME || "/Users/azizdemir", ".config/opencode/meta-api-key");
    return fs.readFileSync(p, "utf8").trim();
  } catch {
    return process.env.OPENAI_API_KEY || process.env.META_API_KEY || "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const apiKey = getMetaKey();
    if (!apiKey) {
      return NextResponse.json({ transcript: "Mock transcript: What happened near the saw around 2pm? (no API key, Web Speech API used instead)", mock: true });
    }

    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey, baseURL: process.env.OPENAI_BASE_URL || undefined });

    // OpenAI Whisper transcription
    const transcription = await client.audio.transcriptions.create({
      file: file as any,
      model: "whisper-1",
    });

    return NextResponse.json({ transcript: transcription.text, model: "whisper-1" });
  } catch (err: any) {
    console.error("transcribe failed", err);
    return NextResponse.json({ transcript: "Transcription failed, fallback to Web Speech API. Try asking: What happened near the saw around 2pm?", error: err.message, fallback: true });
  }
}
