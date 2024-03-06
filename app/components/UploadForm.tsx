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
			console.log('tet', textResponse);
            // pdfAPI returns a string 
            const pdfAPIResponse = textResponse.message;

			parseIntoJSON(pdfAPIResponse);

			isPDFLoading(false);

			// if textRepsonse is undefined we want to throw error
			// TODO: ERROR HANDLING
			
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
			console.log('entered gpt');

            const gptParsedResponse = await gptRes.json();
            const parsedJSONScript = JSON.parse(gptParsedResponse.content);

			console.log('what is GPT response', gptParsedResponse);
			
			// let responseIntoJSON = [];

			// for (let content of gptParsedResponse.content) {
			// 	responseIntoJSON.push(JSON.parse(content));
			// }

			// const parsedJSONScript: { lines: ScriptLineObject[] } = {lines: []};

			// for (let response of responseIntoJSON) {
			// 	let lineArr = response.lines;
			// 	for (let i = 0; i < lineArr.length; i++) {
			// 		parsedJSONScript.lines.push(lineArr[i]);
			// 	}
			// }

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

		// gpt generated code --------------------------------------------------------
		// Use Promise.all to wait for all asynchronous operations to complete
		await Promise.all(scriptLines.map(async (lineObj: ScriptLineObject) => {
			if ((!lineObj.direction && !lineObj.directions) && lineObj.line) {
				let lineToTranspose = lineObj.line.replace(/ *\([^)]*\) */g, "");
				lineToTranspose = lineToTranspose.replace(/\n/g, "");
				
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

		// const audioContext = new AudioContext();

        try {
            const res = await fetch('/api/TTS', {
                method: 'POST',
                body: JSON.stringify(line),
                headers: { 'Content-Type': 'audio/mp3'}
            });

			// maybe we can set up a check here to make sure taht the audio returned IS decode-able
			// otherwise, we have to try with that one again

            const res_data = await res.json();
			// console.log('resdata', res_data);
            const arrayBuffer = Buffer.from(res_data.buffer);
			// console.log('arrayBuffer', arrayBuffer);

			// how can i turn this into a boolean function?
			// await audioContext.decodeAudioData(arrayBuffer, (decodedBuffer) => {

			// }, (error) => {
			// 	// this is error callback 
			// 	// so maybe if the error occurs, we can try again? but that also depends on what the error is
			// 	// .. is it simply a one-off issue? or is it that the first line is actually undecodeable
			// })

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