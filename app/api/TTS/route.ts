import { NextRequest, NextResponse } from 'next/server';
// import the playht SDK
import fs from "fs";
import * as PlayHT from "playht";
import fetch from "node-fetch";

// @ts-ignore
async function streamToBuffer(readableStream) {
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


/* 
    Using PlayHT API to try incorporating TTS
*/
export async function POST(request: NextRequest) {

    // let rando = Math.floor(Math.random() * 1000) + 10;

    let text = (await new Response(request.body).text()).replace(/ *\([^)]*\) */g, "");
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
            output_format: "mp3",
            sample_rate: "24000",
            speed: 1,
        }),
    };

    const response = await fetch(url, options);
    const readableStream = response.body;

    // console.log('what is readable stream', readableStream);
    // console.log('type? ', typeof readableStream);

    // let buffer: Buffer;

    let buffer = await streamToBuffer(readableStream);
    // console.log('what is buffer', buffer);
        // .then(imageBuffer => {
        //     // console.log('what? ', imageBuffer);
        //     return NextResponse.json({ buffer: buffer });
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        // });

    // readableStream ? readableStream.pipe(fs.createWriteStream(`./public/audioFiles/audio_${rando}.mp3`)) : console.error('not readable');
    // readableStream ? readableStream.pipe(fs.createWriteStream(`./public/audioFiles/audio.mp3`)) : console.error('not readable');
    // readableStream ? readableStream.pipe() : console.error('not readable');

    // can we convert the audio file into an audio buffer object now?


    // anytime i try to use PlayHT.{function} it returns 'cannot find module tls';
    // const generated = await PlayHT.generate('Computers can speak now!');

    // // Grab the generated file URL
    // const { audioUrl } = generated;
    // console.log('The url for the audio file is', audioUrl);

    // const audio = new Audio();
    // audio.src = audioUrl;
    // audio.load();
    // audio.play();

    // we return the buffer object 
    return NextResponse.json({ buffer: buffer });
    // return NextResponse.json({ message: "Did not return" });
}


/* 
export type SharedSpeechOptions = {
    voiceEngine: VoiceEngine;
    voiceId?: string;
    inputType?: InputType;
    speed?: number;
    quality?: OutputQuality;
};

*/