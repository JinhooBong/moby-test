// import { NextRequest, NextResponse } from 'next/server';
// import fetch from 'node-fetch';
// // import * as PlayHT from 'playht';

// // PlayHT.init({
// //   apiKey: process.env.PLAYHT_KEY!,
// //   userId: process.env.PLAYHT_USERID!,
// // });

// export async function POST(request: NextRequest) {

//     let text = (await new Response(request.body).text());
//     // console.log('TTS body', text);

//     // const url = 'https://api.play.ht/api/v2/tts/stream';
// 	const url = 'https://api.play.ht/api/v2/tts';

//     const options = { 
//         method: 'POST',
//         headers: {
//             // accept: 'audio/mpeg',
// 			accept: 'text/event-stream',
//             'content-type': 'application/json',
//             AUTHORIZATION: process.env.PLAYHT_KEY!,
//             'X-USER-ID': process.env.PLAYHT_USERID!,
// 			// Authorization: `Bearer ${process.env.PLAYHT_KEY!}`,
//     		// 'X-USER-ID': process.env.PLAYHT_USERID!,
//         },
//         body: JSON.stringify({
// 			// voice_engine: 'PlayHT2.0-turbo',
//             voice_engine: 'PlayHT2.0',
//             text: text,
//             voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
//             output_format: 'mp3',
//             // sample_rate: '24000',
//             // speed: 1,
//         }),
//     };

//     const response = await fetch(url, options)

// 	// console.log('response', response.headers);
// 	// console.log('asdfasdfad', response.headers.get('content-location'));

// 	const audio = await fetch(response.headers.get('content-location')!, options);	
// 	console.log('audio', audio);
// 	const arrayBufferAudio = await audio.arrayBuffer();
// 	console.log('buffer', arrayBufferAudio);

//     const readableStream = response.body;

// 	// // console.log('readbale stream?', readableStream);

//     let buffer: Buffer = await streamToBuffer(readableStream);
// 	// console.log('buffer', buffer);

//     // // we return the buffer object 
//     return NextResponse.json({ buffer: buffer });
// }

// /* Helper function to convert data into buffer */
// // @ts-ignore
// async function streamToBuffer(readableStream): Buffer {
//     return new Promise((resolve, reject) => {
//         // @ts-ignore
//       const chunks = [];
//       // @ts-ignore
//       readableStream.on('data', data => {
//         if (typeof data === 'string') {
//           // Convert string to Buffer assuming UTF-8 encoding
//           chunks.push(Buffer.from(data, 'utf-8'));
//         } else if (data instanceof Buffer) {
//           chunks.push(data);
//         } else {
//           // Convert other data types to JSON and then to a Buffer
//           const jsonData = JSON.stringify(data);
//           chunks.push(Buffer.from(jsonData, 'utf-8'));
//         }
//       });
//       readableStream.on('end', () => {
//         // @ts-ignore
//         resolve(Buffer.concat(chunks));
//       });
//       readableStream.on('error', reject);
//     });
// }



import { NextRequest, NextResponse } from 'next/server';

const textToSpeech = require('@google-cloud/text-to-speech');
// Import other required libraries
const fs = require('fs');
const util = require('util');

export async function POST(request: NextRequest) {
	let text = (await new Response(request.body).text());
	// console.log('TTS body', text);
	
<<<<<<< HEAD
	// we need to take out the "\n" in the text 
	const properText = text.replace("\n", "");
=======
	// const properText = text.replace(/\n/g, "");
	const properText = text.replace("\n", "");
	// console.log('TTS body', properText);
>>>>>>> 71ee2573 (firebase launched and making some updates)

	// Creates a client
	const client = new textToSpeech.TextToSpeechClient();

	// Construct the request
	const gc_request = {
		input: {text: properText},
		// Select the language and SSML voice gender (optional)
		voice: {
			languageCode: 'en-US', 
			ssmlGender: 'MALE',
			voiceType: "Standard",
			voiceName: "en-US-Standard-I"
		},
		// select the type of audio encoding
		audioConfig: {audioEncoding: 'MP3'},
	  };

	// Performs the text-to-speech request
	const [response] = await client.synthesizeSpeech(gc_request);
	// console.log('what is response', response);
	// console.log('what is ', response.audioContent);

    return NextResponse.json({ buffer: response.audioContent });

	// response.audioContent is buffer object

	// const writeFile = util.promisify(fs.writeFile);
	// await writeFile('output.mp3', response.audioContent, 'binary');
	// console.log('Audio content written to file: output.mp3');


}	