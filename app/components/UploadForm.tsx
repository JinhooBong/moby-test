'use client'

import { useState } from 'react';
import { ScriptView } from './ScriptView';
import { ScriptLineObject } from './ScriptLine';

export interface ScriptObject {
    lines: ScriptLineObject[]
}

export function UploadForm() {
    const [file, setFile] = useState<File>();
    const [textContent, setTextContent] = useState<ScriptObject>();
    const [audioReady, setAudioReady] = useState(false);

    const convertTextToSpeech = async (input: string) => {
        try {
            const res = await fetch('/api/TTS', {
                method: 'POST',
                body: input
            });

            const res_data = await res.json();
            // console.log('res data?', res_data);
            const arrayBuffer = Buffer.from(res_data.buffer);

            return arrayBuffer;
        } catch (e: any) {
            // handle errors here
            console.error(e);
        }
    }

    const fnTTS = (scriptWithoutAudio: ScriptObject) => {

        scriptWithoutAudio.lines.forEach(async (item: ScriptLineObject) => {
            if ((!item.directions && !item.direction) && item.line) {
                const audioFile = await convertTextToSpeech(item.line);
                item.audioBuffer = audioFile;
            } 
        })
        setTextContent(scriptWithoutAudio);

        setAudioReady(true);
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        try {
            const data = new FormData();
            data.set('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })

            const textResponse = await res.json();
            const pdfAPIResponse = textResponse.message;
            console.log('console text', pdfAPIResponse);

            // dataToParse is a string object 
            // we can maybe split by line
            // but we'll need a way to identify between dialogue and scene directions
            // console.log('type', dataToParse.split("\n"));

            const gptRes = await fetch('/api/parser', {
                method: 'POST',
                body: pdfAPIResponse
            });

            const gptParsedResponse = await gptRes.json();
            const parsedJSONObj = JSON.parse(gptParsedResponse.content);
            console.log('parsed', parsedJSONObj);

            // this should be in format {"lines": [{direction} || {character}]}

            // parsedJSONObj.lines.forEach(async (item: ScriptLineObject) => {
            //     if ((!item.directions && !item.direction) && item.line) {
            //         const audioFile = await convertTextToSpeech(item.line);
            //         item.audioBuffer = audioFile;
            //     }   
            // })

            fnTTS(parsedJSONObj);

            // parsedData ? setTextContent(parsedData) : setTextContent({ lines: [] })

            // handle the error
            // if (!res.ok) throw new Error(await res.text());
                
        } catch (e: any) {
            // Handle errors here
            console.error(e);
        }
    }

    const setScript = (script:ScriptObject) => {
        setAudioReady(true);
        setTextContent(script);
    }

    return (
        <div>
            {audioReady && textContent? <><ScriptView lines={textContent.lines} /></> : <form onSubmit={onSubmit}>
                <input
                    type="file"
                    name="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                />
                <input type="submit" value="Upload" />
            </form>}
        </div>
    )
}
/* 

what is the flow of the document?

the document gets uploaded
the pdf gets parsed
the parsedData gets passed to openAI to create JSON object
each line of the JSON object gets passed into convert text to speech
once the conversion is completed, then render the script view 



*/