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

    console.log('what is file', uploadedFile);

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

    console.log('file', file);

    // created the assistant
    const assistant = await openai.beta.assistants.create({
        instructions: "You are a helpful assistant in parsing movie scripts. Provided a movie script document, please separate the script into character names, lines, and scene directions in order from top to bottom. Please put this into a JSON format.",
        model: "gpt-4-1106-preview",
        tools: [{ "type": "code_interpreter" }],
        file_ids: [file.id]
    });

    console.log('assistant', assistant);

    // created a thread
    const thread = openai.beta.threads.create();
    console.log("thread created");

    const message = await openai.beta.threads.messages.create(
        (await thread).id,
        {
            role: "user",
            content: "I need you to parse the provided movie script.",
            file_ids: [file.id]
        }
    )

    console.log('message', message);

    // run the assistant
    const run = await openai.beta.threads.runs.create(
        (await thread).id,
        {
            assistant_id: assistant.id,
            instructions: "Please return the response in a JSON object."
        }
    )

    console.log('run', run);

    // check the run status
    const run_status = await openai.beta.threads.runs.retrieve(
        (await thread).id,
        run.id
    );

    console.log('run status', run);

    // display the assistant's response
    const messages = await openai.beta.threads.messages.list(
        (await thread).id
    );

    console.log('messages', messages);

    for (const content_item in messages.data[0].content) {
        console.log(content_item);
    }


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