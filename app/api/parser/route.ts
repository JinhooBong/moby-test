import { unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from "fs";

export async function POST(request: NextRequest) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

    // const body = await request.json();
    // console.log('body', body);

    const data = request.body;

    // let str = Buffer.from(data?.buffer).toString();

    // grab the script in text form 
    let scriptInTextForm = await new Response(data).text();

    console.log('entered gpt');
    // console.log('script', scriptInTextForm);

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

    /* ------------------------------------------------------- 
    
    BUG #1: the ordering was incorrect with (ABS_script_4) it sections off "directions" and "dialogues" so this caused two separate entities - we want to keep it in order from top to bottom.. so maybe more strict instructions for openai

    BUG #2: the word "-DEMO-" is thrown into the response in at least one of the lines. This could be a result of using the demo version, and could be a simple fix as openAI releases and publishes? or could be something that I need to look into
    --- this bug seemed to go away at least today? of the few that i've tested thus far it did not prove to be an issue.

    --------------------------------------------------------*/

    console.log('returned msg', completion.choices[0].message.content);

    return NextResponse.json({ success: true, content: completion.choices[0].message.content })
}