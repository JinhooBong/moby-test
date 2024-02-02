// what is the flow of the document?

// the document gets uploaded
// it gets sent to PDF API to get parsed from PDF into string object 
// the string object returned from PDF API gets passed to openAI to create a JSON object
// each line of the JSON object gets passed into convert text to speech
// once the conversion is completed, then render the script view 

// // audio API is just taking awhile to load... so the scriptview needs to wait for the 
// // audio to load before the scriptview loads. 

'use client';

import React, { useState, FormEvent } from 'react';
import { ScriptLineObject } from './ScriptLine';

interface UploadFormProps {
    setLoading: Function,
    setTheScript: Function,
    showScript: Function
}

export const UploadForm: React.FC<UploadFormProps> = ({ setLoading, setTheScript, showScript }) => {

    const [file, setFile] = useState<File>();

    const parseFileIntoPDF = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        // if file is not set, return the function bc we can't do anything
        if (!file) return;

        // call the convert to pdf api call
        try {
            const data = new FormData();
            data.set('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            });

            const textResponse = await res.json();
            // pdfAPI returns a string 
            const pdfAPIResponse = textResponse.message;
            console.log('console text', pdfAPIResponse);

            parseIntoJSON(pdfAPIResponse);

            return;
        } catch (e: any) {
            console.error('pdf parse error: ', e);
        }
    }

    const parseIntoJSON = async (pdfToParse: string) => {
       
        try {
            const gptRes = await fetch('/api/parser', {
                method: 'POST',
                body: pdfToParse
            });
    
            const gptParsedResponse = await gptRes.json();
            const parsedJSONScript = JSON.parse(gptParsedResponse.content);
            console.log('parsed', parsedJSONScript);

            if (parsedJSONScript.lines) {
                parsedJSONScript.lines.forEach( (lineObj: ScriptLineObject) => {
                    // we want to skip any scene directions and make sure the character has a line
                    if ((!lineObj.direction && !lineObj.directions) && lineObj.line) {
                        let lineToTranspose = lineObj.line.replace(/ *\([^)]*\) */g, "")
                        convertTextToSpeech(lineToTranspose)
                            .then((buffer) => lineObj.audioBuffer = buffer);
                    }
                })
            }

            await setTheScript(parsedJSONScript);

            // this timeout sort of stalls the process giving the convertTextToSpeech time to add all the
            // necessary audio buffers... but its not ideal
            setTimeout(() => {
                showScript(true);
            }, 4000);

            return;
        } catch (e: any) {
            console.error('gpt error: ', e);
        }

    }

    const convertTextToSpeech = async (line: string) => {
        try {
            const res = await fetch('/api/TTS', {
                method: 'POST',
                // body: 
                body: JSON.stringify(line),
                headers: { "Content-Type": "audio/mp3"}
            });

            const res_data = await res.json();
            // console.log('res data?', res_data);
            const arrayBuffer = Buffer.from(res_data.buffer);
            // console.log('after', arrayBuffer);

            return arrayBuffer;

        } catch (e: any) {
            console.error('TTS error: ', e);
        }
    }

    return (
        <>
            <div>
                <form onSubmit={(e) => parseFileIntoPDF(e)}>
                    <input type='file' name='file' onChange={(e) => setFile( e.target.files?.[0])} />
                    <input type='submit' value='Upload' />
                </form>
            </div>
        </>
    )
}