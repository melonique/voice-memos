'use server'
import { speechToText } from '@/services/whisper'
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.formData();
    const file = body.get("file");

    const text = await speechToText(file)

    return NextResponse.json({ text });
  } catch (error) {
    throw error;
  }
}
