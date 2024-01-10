import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import fs from "fs";

// export async function POST(request: NextRequest) {
//     const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

//     const data = await request.formData();
//     const uploadedFile: File | null = data.get('file') as unknown as File;

//     if (!uploadedFile) {
//         return NextResponse.json({ success: false });
//     }

//     console.log('what is file', uploadedFile);

//     const bytes = await uploadedFile.arrayBuffer();
//     const buffer = Buffer.from(bytes);

//     // With the file data in the buffer, you can do whatever you want with it.
//     // For this, we'll just write it to the filesystem in a new location
//       const path = `/tmp/${uploadedFile.name}`
//       await writeFile(path, buffer)
//     //   console.log(`open ${path} to see the uploaded file`)

//     const file = await openai.files.create({
//         file: fs.createReadStream(path),
//         purpose: "assistants"
//     });

//     console.log('file', file);

//     // created the assistant
//     const assistant = await openai.beta.assistants.create({
//         // instructions: "You are a helpful assistant that will parse movie scripts provided in a PDF format. The format of the movie script will be of the following: lines will be center-aligned whereas scene directions will be left-aligned. Please separate character names, their lines, and scene directions in order from top to bottom. Please return this in a JSON object form.",
//         instructions: "You are a helpful assistant that will parse movie scripts. The provided file will be in PDF format. You will separate character names, their lines, and scene directions in order from top to bottom. ",
//         model: "gpt-4-1106-preview",
//         tools: [{ "type": "code_interpreter" }],
//         file_ids: [file.id]
//     });
//     // const assistant = await openai.beta.assistants.create({
//     //     name: "Math Tutor",
//     //     instructions: "You are a personal math tutor. Write and run code to answer math questions.",
//     //     tools: [{ type: "code_interpreter" }],
//     //     model: "gpt-4-1106-preview"
//     // });
      

//     console.log('assistant', assistant);

//     // created a thread
//     // const thread = openai.beta.threads.create();
//     const thread = await openai.beta.threads.create();
//     console.log("thread created");

//     const message = await openai.beta.threads.messages.create(
//         (await thread).id,
//         {
//             role: "user",
//             content: "Please take the provided file and return the separated information.",
//             file_ids: [file.id]
//         }
//     )
//     // const message = await openai.beta.threads.messages.create(
//     //     thread.id,
//     //     {
//     //       role: "user",
//     //       content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
//     //     }
//     //   );

//     // const messageList = await openai.beta.threads.messages.list(
//     //     thread.id
//     // )

//     // console.log('messagesList', messageList.data[0].content);

//     // console.log('message', message);

//     // run the assistant
//     let run = await openai.beta.threads.runs.create(
//         (await thread).id,
//         {
//             assistant_id: assistant.id,
//             instructions: "Please return only the final output of your response."
//         }
//     )

//     // let run = await openai.beta.threads.runs.create(
//     //     thread.id,
//     //     { 
//     //       assistant_id: assistant.id,
//     //       instructions: "Please address the user as Jane Doe. The user has a premium account."
//     //     }
//     // );
//     // console.log('run', run);

//     // const run_status = await openai.beta.threads.runs.retrieve(
//     //     thread.id,
//     //     run.id
//     // );

//     while (run.status !== "completed" && run.status !== "failed") {
//         run = await openai.beta.threads.runs.retrieve(
//             thread.id,
//             run.id
//         )
//         console.log('status', run.status);
//     }

//     let messages;

//     if (run.status == "completed") {
//         messages = await openai.beta.threads.messages.list(
//             thread.id
//         )

//         // messages.data is an array
//         for (let i = 0; i < messages.data.length; i++) {
//             console.log(messages.data[i].content)
//         }
//     }



//     // // check the run status
//     // const run_status = await openai.beta.threads.runs.retrieve(
//     //     (await thread).id,
//     //     run.id
//     // );

//     // console.log('run status', run_status);

//     // display the assistant's response
//     // const messages = await openai.beta.threads.messages.list(
//     //     (await thread).id
//     // );

//     // const messages = await openai.beta.threads.messages.list(
//     //     thread.id
//     //   );
//     // console.log('messages', messages);
//     // messages is a ThreadMessagesPage Object with a data

//     // console.log('messages.data', messages.body.data)
//     // data is an array

//     // console.log('content', messages.data[0].content[1]);

//     // for (let i = 0; i < messages.data.length; i++) {
//     //     console.log(messages.data[0])
//     // }

//     // for (const content_item in messages.data[0].content) {
//     //     console.log(content_item);
//     // }


//     // file contains this
//     /* 
//         File {
//             size: 23482,
//             type: 'application/pdf',
//             name: 'ABS Test Script-5.pdf',
//             lastModified: 1703023564583
//         }
//     */

    

//     //   console.log('what is bfufer', buffer);



//     return NextResponse.json({ success: true })
// }

export async function POST( request: NextRequest ) {
    const data = await request.formData();
    const uploadedFile: File | null = data.get('file') as unknown as File;

    if (!uploadedFile) {
        return NextResponse.json({ success: false });
    }

    console.log('what is file', uploadedFile);

    const bytes = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(bytes);


    // console.log('buffer', buffer);
    // console.log('buffertostring2222', buffer.toString('base64'));

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    const path = `/tmp/${uploadedFile.name}`
    await writeFile(path, buffer);
    //   console.log(`open ${path} to see the uploaded file`)

    var pdfcrowd = require("pdfcrowd");
    var client = new pdfcrowd.PdfToTextClient("demo", "ce544b6ea52a5621fb9d55f8b542d14d");
  
    client.convertFileToFile(
        path,
        "invoice.txt",
        function(err: string, fileName: string) {
            if (err) return console.error("Pdfcrowd Error: " + err);

            console.log("Success: the file was created " + fileName);
    })

    let textData = '';

    const pdfParse = require('pdf-parse');
    let readFile = fs.readFileSync(path);
    try {
        let pdfExtract = await pdfParse(readFile)
        console.log('File content: ', pdfExtract.text)
      } catch (error) {
        console.error('error', error);
      }


    // // PROBLEM HERE: is that invoice.txt is not being updated BEFORE being read.. 
    // /* ---------------------------------------------------------------------------

    // BUG #1: the problem here is that the file is converted AFTER the file is read 
    // so essentially we'lre reading the previously uploaded file instead of the current one
    // this is a result of async / await that i'll need to implement / fix

    // THIS IS A CRUCIAL BUG 

    // ----------------------------------------------------------------------------*/ 
    
    try {  
        // grabbed the text content from the file
        textData = fs.readFileSync('invoice.txt', 'utf8');
        console.log('text', textData.toString());    
    } catch(e: any) {
        console.log('Error:', e.stack);
    }

    return NextResponse.json({ message: textData.toString() });
}