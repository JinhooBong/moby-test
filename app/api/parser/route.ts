import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// function chunkString(str: string, size: number) {
//     const chunks = [];
//     for (let i = 0; i < str.length; i += size) {
//         chunks.push(str.slice(i, i + size));
//     }
//     return chunks;
// }

export async function POST(request: NextRequest) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

    const data = request.body;

    // grab the script in text form 
    let scriptInTextForm = await new Response(data).text();

	// Split the long script string into smaller chunks
    // const chunkSize = 1000; // Adjust this size based on OpenAI's API limits
    // const scriptChunks = chunkString(scriptInTextForm, chunkSize);

	// Array to store responses from OpenAI
    // const responses = [];

    // console.log("scriptInTextForm", scriptInTextForm);

    // console.log("entered gpt");

    // now we send scriptInTextForm to openAI's chat completion api
    const completion = await openai.chat.completions.create({
        messages: [
            {
              role: "system",
              content: "You are a helpful assistant that will parse movie scripts. This script will be provided as a body of text. You will parse it in order from top to bottom strictly. Please return the answer in the following format of a JSON object { \"lines\": } where the value will be either { \"directions\": \"\" } or { \"character\": \"\", \"line\": \"\"} where the separated values will go. ",
            },
            {
                role: "system",
                content:"Please separate character names, their lines, and scene directions in strict order from top to bottom. Please double check to make sure it's in order. Please return this in a JSON object. The objects should be of the following two object forms: An object with property `direction` for scene directions, and an object with properties `character` and `line` where the character name and their lines will reside. Again please make sure that the lines stay in order from top to bottom."
            },
			{
				role: "system",
				content: "Usually character lines will be a character's name in all caps followed by a new line and their corresponding dialogue. Character names are surrounded by \r\n so please separate accordingly. Scene directions might include names but they are not followed by \n characters so please separate accordingly."
			},
            { role: "user", content: scriptInTextForm },
        ],
		model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
    });

	// Loop through each script chunk and send requests to OpenAI
	// for (const scriptChunk of scriptChunks) {
	// 	const completion = await openai.chat.completions.create({
	// 		messages: [
	// 			{
	// 				role: "system",
	// 				content: "You are a helpful assistant that will parse movie scripts. This script will be provided as a body of text. You will parse it in order from top to bottom strictly. Please return the answer in the following format of a JSON object { \"lines\": } where the value will be either { \"directions\": \"\" } or { \"character\": \"\", \"line\": \"\"} where the separated values will go",
	// 			},
	// 			{
	// 				role: "system",
	// 				content: "Please separate character names, their lines, and scene directions in strict order from top to bottom. Please double check to make sure it's in order. Please return this in a JSON object. The objects should be of the following two object forms: An object with property `direction` for scene directions, and an object with properties `character` and `line` where the character name and their lines will reside. Again please make sure that the lines stay in order from top to bottom.",
	// 			},
	// 			{ role: "user", content: scriptChunk },
	// 		],
	// 		// model: "gpt-4-turbo-preview",
	// 		model: "gpt-4-1106-preview",
	// 		response_format: { type: "json_object" },
	// 	});

	// 	// Store the response content in the array
	// 	responses.push(completion.choices[0].message.content);
	// }

	// console.log('what is response', responses);


    // console.log("returned msg", completion.choices[0].message.content);

    return NextResponse.json({ success: true, content: completion.choices[0].message.content })
	// return NextResponse.json({ success: true, content: responses });
	// return NextResponse.json({ success: true, content: combinedResponse });
}