'use client';

import React, { useState, FormEvent } from 'react';
import { ScriptLineObject } from './ScriptLine';
import { decode } from 'punycode';

interface UploadFormProps {
    setTheScript: Function,
    showScript: Function,
    hideUpload: Function,
    isPDFLoading: Function,
    isGPTLoading: Function,
    isTTSLoading: Function,
    isLoading: Function
}

export const UploadForm: React.FC<UploadFormProps> = ({ 
    setTheScript, 
    showScript, 
    hideUpload, 
    isPDFLoading, 
    isGPTLoading,
    isTTSLoading,
    isLoading
}) => {

    const [file, setFile] = useState<File>();

    const parseFileIntoPDF = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        isLoading(true);
        hideUpload(true);
        isPDFLoading(true);

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
            console.log('pdf response: ', pdfAPIResponse);

            parseIntoJSON(pdfAPIResponse);

            isPDFLoading(false);

            return;
        } catch (e: any) {
            console.error('pdf parse error: ', e);
        }
    }

    const parseIntoJSON = async (pdfToParse: string) => {

        isGPTLoading(true);
        isTTSLoading(true);

        try {
            const gptRes = await fetch('/api/parser', {
                method: 'POST',
                body: pdfToParse
            });
    
            const gptParsedResponse = await gptRes.json();
            const parsedJSONScript = JSON.parse(gptParsedResponse.content);
            console.log('GPT response', parsedJSONScript);

            const audioSuccessfullyAttached = await attachAudioObjects(parsedJSONScript.lines);

            audioSuccessfullyAttached ? (setTheScript(parsedJSONScript), showScript(true)) : null;
            
            isTTSLoading(false);
            isLoading(false);
            isGPTLoading(false);

            return;
        } catch (e: any) {
            console.error('gpt error: ', e);
        }
    }

    // Helper function to make sure that all audio buffer objects have been appended before returning true
    const attachAudioObjects = async (scriptLines: ScriptLineObject[]) => {

        const audioContext = new AudioContext();

        // forEach is synchronous so until this operation is complete, it won't reach the return 
        scriptLines.forEach((lineObj: ScriptLineObject) => {
            if ((!lineObj.direction && !lineObj.directions) && lineObj.line) {
                let lineToTranspose = lineObj.line.replace(/ *\([^)]*\) */g, "");
                convertTextToSpeech(lineToTranspose)
                    .then((buffer) => {
                        // console.log('type buffer', typeof buffer);
                        // const arrayBuffer = Buffer.from(buffer!);
                        const arrayBuffer = new Uint8Array(buffer!).buffer;
                        // console.log('array', typeof arrayBuffer);
                        audioContext.decodeAudioData(arrayBuffer, (decodedBuffer) => {
                            // console.log('decoded', decodedBuffer);
                            lineObj.audioBuffer = decodedBuffer;
                            // lineObj.audioBuffer = buffer;
                        })
                    });
                    
            }
        })

        return true;
    }

    const convertTextToSpeech = async (line: string) => {
        try {
            const res = await fetch('/api/TTS', {
                method: 'POST',
                body: JSON.stringify(line),
                headers: { 'Content-Type': 'audio/mp3'}
            });

            const res_data = await res.json();
            // console.log('res data?', res_data);
            // console.log('buffer', res_data.buffer);
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
                    <input type="file" name="file" onChange={(e) => setFile( e.target.files?.[0])} />
                    <input type="submit" value="Upload" />
                </form>
            </div>
        </>
    )
}