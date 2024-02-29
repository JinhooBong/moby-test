'use client';

import React, { useState, FormEvent } from 'react';
import { ScriptLineObject } from './ScriptLine';

interface UploadFormProps {
    setTheScript: Function,
    showScript: Function,
    hideUpload: Function,
    isPDFLoading: Function,
    isGPTLoading: Function,
    isTTSLoading: Function,
    isLoading: Function,
}

export const UploadForm: React.FC<UploadFormProps> = ({ 
    setTheScript, 
    showScript, 
    hideUpload, 
    isPDFLoading, 
    isGPTLoading,
    isTTSLoading,
    isLoading,
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
			
			if (!gptRes.ok) {
				throw new Error(`Failed to fetch: ${gptRes.status} - ${gptRes.statusText}`);
			}

            const gptParsedResponse = await gptRes.json();
            const parsedJSONScript = JSON.parse(gptParsedResponse.content);
            console.log('GPT response', parsedJSONScript);

            const audioSuccessfullyAttached = await attachAudioObjects(parsedJSONScript.lines);

			if (audioSuccessfullyAttached) {
				setTheScript(parsedJSONScript);
				showScript(true);
			}
            
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
		// however we are running into edge cases where the script does appear "ready" without the audio objects attached
        // scriptLines.forEach((lineObj: ScriptLineObject) => {
        //     if ((!lineObj.direction && !lineObj.directions) && lineObj.line) {
        //         let lineToTranspose = lineObj.line.replace(/ *\([^)]*\) */g, "");
        //         convertTextToSpeech(lineToTranspose)
        //             .then(async (buffer) => {
        //                 // console.log('type buffer', typeof buffer);
        //                 // const arrayBuffer = Buffer.from(buffer!);
        //                 const arrayBuffer = buffer ? new Uint8Array(buffer).buffer : null;
        //                 // console.log('array', typeof arrayBuffer);
        //                 arrayBuffer ? await audioContext.decodeAudioData(arrayBuffer, (decodedBuffer) => {
        //                     // console.log('decoded', decodedBuffer);
        //                     lineObj.audioBuffer = decodedBuffer;
        //                     // lineObj.audioBuffer = buffer;
        //                 }) : (console.log('ERROR')); // catch the error
        //             });
		// 		}
		// 	});

		// gpt generated code --------------------------------------------------------
		// Use Promise.all to wait for all asynchronous operations to complete
		await Promise.all(scriptLines.map(async (lineObj: ScriptLineObject) => {
			if ((!lineObj.direction && !lineObj.directions) && lineObj.line) {
				let lineToTranspose = lineObj.line.replace(/ *\([^)]*\) */g, "");
				try {
					const buffer = await convertTextToSpeech(lineToTranspose);
					const arrayBuffer = buffer ? new Uint8Array(buffer).buffer : null;
	
					if (arrayBuffer) {
						await audioContext.decodeAudioData(arrayBuffer, (decodedBuffer) => {
							lineObj.audioBuffer = decodedBuffer;
						});
					} else {
						console.log('ERROR'); // handle the error
					}
				} catch (error) {
					console.error('Error converting text to speech:', error);
				}
			}
		}));

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
		<div>
			<form onSubmit={(e) => parseFileIntoPDF(e)}>
				<div>
					<input type="file" name="file" onChange={(e) => setFile( e.target.files?.[0])} />
					<input type="submit" value="Upload" />
				</div>
			</form>
		</div>
    )
}