import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request: NextRequest) {

    let text = (await new Response(request.body).text());
    // console.log('TTS body', text);

	// when we switch over to paid and more complex voices, we'll have to adjust here
    const url = 'https://api.play.ht/api/v2/tts/stream';

    const options = {
        method: 'POST',
        headers: {
            accept: 'audio/mpeg',
            'content-type': 'application/json',
            AUTHORIZATION: process.env.PLAYHT_KEY!,
            'X-USER-ID': process.env.PLAYHT_USERID!,
        },
        body: JSON.stringify({
            voice_engine: 'PlayHT2.0-turbo',
            text: text,
            voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
            output_format: 'mp3',
            sample_rate: '24000',
            speed: 1,
        }),
    };

    const response = await fetch(url, options);
    const readableStream = response.body;

    let buffer: Buffer = await streamToBuffer(readableStream);

    // we return the buffer object 
    return NextResponse.json({ buffer: buffer });
}

/* Helper function to convert data into buffer */
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
