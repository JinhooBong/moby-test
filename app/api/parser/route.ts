import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

    console.log(request);
    const data = request.body;
    console.log('data', data);

    return NextResponse.json({ success: true })
}