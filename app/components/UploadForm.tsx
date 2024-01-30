// 'use client'

// import { useState } from 'react';
// import { Script } from './Script';
// import { ScriptLineObject } from './ScriptLine';


// // @ts-ignore
// export function UploadForm({setScript, setLoading}) {
//     const [file, setFile] = useState<File>();
//     const [textContent, setTextContent] = useState<ScriptObject>();
//     const [audioReady, setAudioReady] = useState(false);

//     const parsePDF = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         setLoading(true);

//         if (!file) return;

//         try {
//             const data = new FormData();
//             data.set('file', file);

//             const res = await fetch('/api/upload', {
//                 method: 'POST',
//                 body: data
//             })

//             const textResponse = await res.json();
//             // pdfAPI returns a string 
//             const pdfAPIResponse = textResponse.message;
//             console.log('console text', pdfAPIResponse);

//             /* FUTURE CASE  
//                 be able to convert this string into JSON object by splitting between
//                 dialogue and scene directions
//             */

//             parseIntoJSON(pdfAPIResponse);

//         } catch (e: any) {
//             console.error(e);
//         }
//     }

//     // Turn string from PDF parser into a JSON object
//     const parseIntoJSON = async (pdfParsed: string) => {

//         const gptRes = await fetch('/api/parser', {
//             method: 'POST',
//             body: pdfParsed
//         });

//         const gptParsedResponse = await gptRes.json();
//         const parsedJSONObj = JSON.parse(gptParsedResponse.content);
//         console.log('parsed', parsedJSONObj);

//         /* 
//             iterate through each line, and if the line is a character line,
//             pass it into TTS and append the audio file buffer into the JSON obj
//         */
//         parsedJSONObj.lines.forEach( async (item: ScriptLineObject) => {
//             console.log('before', item);
//             if ((!item.directions && !item.direction) && item.line) {
//                 // const audioFile = convertTextToSpeech(item.line);
//                 // item.audioBuffer = audioFile;

//                 // convertTextToSpeech(item.line, item)
//                 // .then((data) => {
//                 //     item.audioBuffer = data;
//                 //     console.log('after', item);
//                 // });
//                convertTextToSpeech(item.line, item);
//             //    console.log('after', item);
//             } 
//         });


//         // THIS THROWS OFF SOME JSON REROR
//         setTimeout(() => {
//             setTextContent(parsedJSONObj);
//             setScript(parsedJSONObj);
//             setLoading(false);
//         }, 2000);

//     }


//     const convertTextToSpeech = async (input: string, item: ScriptLineObject) => {
//         try {
//             const res = await fetch('/api/TTS', {
//                 method: 'POST',
//                 body: input
//             });

//             const res_data = await res.json();
//             // console.log('res data?', res_data);
//             const arrayBuffer = Buffer.from(res_data.buffer);

//             setTimeout(() => item.audioBuffer = arrayBuffer, 2000);

//             // return arrayBuffer;
//             // return item;
//             return;
//         } catch (e: any) {
//             // handle errors here
//             console.error(e);
//         }
//     }

//     return (
//         // <>
//         //     {audioReady && textContent ? 
//         //         <ScriptView lines={textContent.lines} />
//         //         : <>
//         //             <form onSubmit={parsePDF}>
//         //                 <input type="file" name="file" onChange={(e) => 
//         //                     setFile(e.target.files?.[0])} />
//         //                 <input type="submit" value="Upload" />
//         //             </form>
//         //         </>
//         //     }
//         // </>}
//         <>
//             <div style={{ display: textContent ? "none" : "block" }}>
//                 <form onSubmit={parsePDF}>
//                     <input type="file" name="file" onChange={(e) =>
//                         setFile(e.target.files?.[0])} />
//                     <input type="submit" value="Upload" />  
//                 </form>
//             </div>
//         </>
//     )
// }
// /* 

// what is the flow of the document?

// the document gets uploaded
// it gets sent to PDF API to get parsed from PDF into string object 
// the string object returned from PDF API gets passed to openAI to create a JSON object
// each line of the JSON object gets passed into convert text to speech
// once the conversion is completed, then render the script view 


// // audio API is just taking awhile to load... so the scriptview needs to wait for the 
// // audio to load before the scriptview loads. 

// */


'use client';

import React, { useState, FormEvent } from 'react';
import { ScriptLineObject } from './ScriptLine';

interface UploadFormProps {
    setLoading: Function,
    setTheScript: Function
}

export const UploadForm: React.FC<UploadFormProps> = ({ setLoading, setTheScript }) => {

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
                parsedJSONScript.lines.map(async (lineObj: ScriptLineObject) => {
                    // we want to skip any scene directions and make sure the character has a line
                    if ((!lineObj.direction && !lineObj.directions) && lineObj.line) {
                        let buffer = await convertTextToSpeech(lineObj.line);
                        lineObj.audioBuffer = await buffer;
                        console.log('should have audio', lineObj);
                    }
                })
            }

            // await setTheScript(parsedJSONScript);
            // this timeout sort of stalls the process giving the convertTextToSpeech time to add all the
            // necessary audio buffers... but its not ideal
            setTimeout(() => {
                setTheScript(parsedJSONScript)
            }, 2000);
               
            return parsedJSONScript;
        } catch (e: any) {
            console.error('gpt error: ', e);
        }

    }

    const convertTextToSpeech = async (line: string) => {
        try {
            const res = await fetch('/api/TTS', {
                method: 'POST',
                body: line
            });

            const res_data = await res.json();
            // console.log('res data?', res_data);
            const arrayBuffer = Buffer.from(res_data.buffer);

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