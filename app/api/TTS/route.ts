import { NextRequest, NextResponse } from 'next/server';
// import the playht SDK
// import fs from "fs";
// import * as PlayHT from "playht";
import fetch from "node-fetch";

// @ts-ignore
async function streamToBuffer(readableStream): Buffer {
    return new Promise((resolve, reject) => {
        // @ts-ignore
      const chunks = [];
      // @ts-ignore
      readableStream.on('data', data => {
        if (typeof data === 'string') {
          // Convert string to Buffer assuming UTF-8 encoding
          chunks.push(Buffer.from(data, 'utf-8'));
        } else if (data instanceof Buffer) {
          chunks.push(data);
        } else {
          // Convert other data types to JSON and then to a Buffer
          const jsonData = JSON.stringify(data);
          chunks.push(Buffer.from(jsonData, 'utf-8'));
        }
      });
      readableStream.on('end', () => {
        // @ts-ignore
        resolve(Buffer.concat(chunks));
      });
      readableStream.on('error', reject);
    });
}


// ****
// Possible rework would be to take the whole script object in
// and then loop through inside, and just append the lines in here
// so then the client is waiting for this call / promise to finish before 
// setting the script

/* 
    Using PlayHT API to try incorporating TTS
*/
export async function POST(request: NextRequest) {

    // let rando = Math.floor(Math.random() * 1000) + 10;

    let text = (await new Response(request.body).text());
    console.log('TTS body', text);

    const url = "https://api.play.ht/api/v2/tts/stream";

    const options = {
        method: "POST",
        headers: {
            accept: "audio/mpeg",
            "content-type": "application/json",
            AUTHORIZATION: process.env.PLAYHT_APIKEY!,
            "X-USER-ID": process.env.PLAYHT_USERID!,
        },
        body: JSON.stringify({
            voice_engine: 'PlayHT2.0-turbo',
            text: text,
            voice: "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
            output_format: "MP3",
            sample_rate: "24000",
            speed: 1,
        }),
    };

    const response = await fetch(url, options);
    const readableStream = response.body;

    // for await (const chunk of response.body!) {
    //     console.log('waht is chunk', chunk);
    // }

    // readableStream?.on('data', (data) => 
    //     console.log('what is this', data ));

    // let buffer;

    // readableStream?.on('data', (data) => {
    //     console.log('data printed', data);
    //     return NextResponse.json({ buffer: data });
    // });

    // console.log('what is readable stream', readableStream);
    // console.log('type? ', typeof readableStream);

    // let buffer: Buffer;

    let buffer: Buffer = await streamToBuffer(readableStream);

    // console.log('what is buffer', buffer);
    // await streamToBuffer(readableStream)
    // .then(imageBuffer => {
    //     console.log('what is this one? ', imageBuffer);
    //     // return NextResponse.json({ buffer: buffer });
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });

    // we return the buffer object 
    return NextResponse.json({ buffer: buffer });
    // return NextResponse.json({ message: "success" })
}