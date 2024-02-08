import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

    const data = request.body;

    // grab the script in text form 
    let scriptInTextForm = await new Response(data).text();
    console.log("scriptInTextForm", scriptInTextForm);

    console.log("entered gpt");

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
            { role: "user", content: scriptInTextForm },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
    });

    console.log("returned msg", completion.choices[0].message.content);

    return NextResponse.json({ success: true, content: completion.choices[0].message.content })
}