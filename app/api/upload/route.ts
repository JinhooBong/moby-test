import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import fs from "fs";

export async function POST(request: NextRequest) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

    const data = await request.formData();
    const uploadedFile: File | null = data.get('file') as unknown as File;

    if (!uploadedFile) {
        return NextResponse.json({ success: false });
    }

    const bytes = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
      const path = `/tmp/${uploadedFile.name}`
      await writeFile(path, buffer)
    //   console.log(`open ${path} to see the uploaded file`)

    const file = await openai.files.create({
        file: fs.createReadStream(path),
        purpose: "assistants"
    });

    const assistant = await openai.beta.assistants.create({
        instructions: "You are a helpful assistant in parsing movie scripts. Provided a movie script document, please separate the script into character names, lines, and scene directions in order from top to bottom. Please put this into a JSON format.",
        model: "gpt-4-1106-preview",
        tools: [{ "type": "code_interpreter" }],
        file_ids: [file.id]
    });

    console.log('file', file);

    console.log('assistant', assistant);

    console.log('what is file', uploadedFile);

    const specific_assistant = openai.beta.assistants.retrieve(assistant.id);
    console.log("assistant located");

    const thread = openai.beta.threads.create();
    console.log("thread created");

    const messages = openai.beta.threads.messages.list((await thread).id);

    console.log((await messages).data);




    // file contains this
    /* 
        File {
            size: 23482,
            type: 'application/pdf',
            name: 'ABS Test Script-5.pdf',
            lastModified: 1703023564583
        }
    */

    

    //   console.log('what is bfufer', buffer);



    return NextResponse.json({ success: true })
}