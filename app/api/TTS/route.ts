import { NextRequest, NextResponse } from 'next/server';
// import the playht SDK
import * as PlayHT from "playht";
import fs from "fs";

/* 
    Using PlayHT API to try incorporating TTS
*/
export async function POST(request: NextRequest) {

    // const fs = require('fs');
    
    // Initialize PlayHT API with your credentials
    PlayHT.init({
        apiKey: process.env.PLAYHT_APIKEY! ,
        userId: process.env.PLAYHT_USERID!
    });
  
    // configure your stream
    const streamingOptions = {
        // must use turbo for the best latency
        voiceEngine: "PlayHT2.0-turbo",
        // this voice id can be one of our prebuilt voices or your own voice clone id, refer to the`listVoices()` method for a list of supported voices.
        voiceId:
        "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
        // you can pass any value between 8000 and 48000, 24000 is default
        sampleRate: 24000,
        // the generated audio encoding, supports 'raw' | 'mp3' | 'wav' | 'ogg' | 'flac' | 'mulaw'
        outputFormat: 'mp3',
        // playback rate of generated speech
        speed: 1,
    };

    // start streaming!
    const text = "Hey, this is Jennifer from Play. Please hold on a moment, let me just um pull up your details real quick."

    //  ⨯ Error: Cannot find module 'tls'

    const stream = await PlayHT.stream(text, { voiceEngine: "PlayHT2.0-turbo", voiceId:
    "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json", sampleRate: 24000,  outputFormat: 'mp3',  speed: 1,});

    stream.on("data", (chunk) => {
    // Do whatever you want with the stream, you could save it to a file, stream it in realtime to the browser or app, or to a telephony system
        fs.writeFileSync("./audio.mp3", chunk);
        console.log('wrote audio file')
    });

}

//  Error: Cannot find module 'tls'