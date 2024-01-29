'use client'

import { useState } from 'react';
import { Script } from './Script';
import { ScriptLineObject } from './ScriptLine';
export interface ScriptObject {
    lines: ScriptLineObject[]
}

export function UploadForm() {
    const [file, setFile] = useState<File>();
    const [textContent, setTextContent] = useState<ScriptObject>();
    const [audioReady, setAudioReady] = useState(false);
    const [loading, setLoading] = useState(false);

    const parsePDF = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);

        if (!file) return;

        try {
            const data = new FormData();
            data.set('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })

            const textResponse = await res.json();
            // pdfAPI returns a string 
            const pdfAPIResponse = textResponse.message;
            console.log('console text', pdfAPIResponse);

            /* FUTURE CASE  
                be able to convert this string into JSON object by splitting between
                dialogue and scene directions
            */

            parseIntoJSON(pdfAPIResponse);

        } catch (e: any) {
            console.error(e);
        }
    }

    // Turn string from PDF parser into a JSON object
    const parseIntoJSON = async (pdfParsed: string) => {

        const gptRes = await fetch('/api/parser', {
            method: 'POST',
            body: pdfParsed
        });

        const gptParsedResponse = await gptRes.json();
        const parsedJSONObj = JSON.parse(gptParsedResponse.content);
        console.log('parsed', parsedJSONObj);

        /* 
            iterate through each line, and if the line is a character line,
            pass it into TTS and append the audio file buffer into the JSON obj
        */
        parsedJSONObj.lines.forEach((item: ScriptLineObject) => {
            console.log('before', item);
            if ((!item.directions && !item.direction) && item.line) {
                // const audioFile = convertTextToSpeech(item.line);
                // item.audioBuffer = audioFile;

                convertTextToSpeech(item.line)
                .then((data) => {
                    item.audioBuffer = data;
                    console.log('after', item);
                });
            } 
        });


        setTimeout(() => {
            setTextContent(parsedJSONObj);
            setAudioReady(true)
        }, 3000);
    }


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

    return (
        // <>
        //     {audioReady && textContent ? 
        //         <ScriptView lines={textContent.lines} />
        //         : <>
        //             <form onSubmit={parsePDF}>
        //                 <input type="file" name="file" onChange={(e) => 
        //                     setFile(e.target.files?.[0])} />
        //                 <input type="submit" value="Upload" />
        //             </form>
        //         </>
        //     }
        // </>}
        <>
            { console.log('textContent', textContent)}
            {loading ? <p>Loading...</p> 
                : <div style={{ display: textContent ? "none" : "block" }}>
                    <form onSubmit={parsePDF}>
                        <input type="file" name="file" onChange={(e) =>
                            setFile(e.target.files?.[0])} />
                        <input type="submit" value="Upload" />  
                    </form>
                </div>}
            {audioReady ? <Script lines={textContent!.lines} /> : <></>}
        </>
    )
}
/* 

what is the flow of the document?

the document gets uploaded
it gets sent to PDF API to get parsed from PDF into string object 
the string object returned from PDF API gets passed to openAI to create a JSON object
each line of the JSON object gets passed into convert text to speech
once the conversion is completed, then render the script view 


// audio API is just taking awhile to load... so the scriptview needs to wait for the 
// audio to load before the scriptview loads. 

*/