"use client";

// const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
// const fetch = require("cross-fetch");


// input: the script, and the index of the script
// we want to check to make sure that the input from the speech recognition matches the script at index..
// if it matches, and the next line is still the reader, then we want to still check otherwise we just increment
// until it is the reader's turn again.
import React from 'react';
import { ScriptLineObject } from './ScriptLine';

interface STTProps {
    script: ScriptLineObject[],
    index: number,
    updateIndex: Function
}

export const STT: React.FC<STTProps> = ({ script, index, updateIndex }) => {

    const fuzzball = require('fuzzball');

    const [transcribed, setTranscribed] = React.useState('');

    // we check to see which line we're currently on
    // if the line that we're currently on is a scene direction, we increment until the line is not a scene line
    

    const start = () => {

        if (script[index].direction || script[index].directions) {
            updateIndex(index+1);
            start();
        } else {
            const SpeechRecognition: any = window.SpeechRecognition || window.webkitSpeechRecognition;

            const recognition = new SpeechRecognition();

            recognition.start();
            recognition.continuous = true;

            recognition.onresult = (event: any) => {
                const speechInput = event.results[0][0].transcript;
                console.log('speechInput', speechInput);
                setTranscribed(speechInput);
            };
            recognition.onspeechend = () => {
                const score = fuzzball.ratio(transcribed, script[index].line);
                console.log('score', score);
                if (score > 80) {
                    updateIndex(index+1);
                    start();
                }
                recognition.stop();
            }
        }

        
        // const SpeechRecognition: any = window.SpeechRecognition || window.webkitSpeechRecognition;

        // const recognition = new SpeechRecognition();

        // recognition.start();
        // recognition.continuous = true;

        // recognition.onresult = (event: any) => {
        //     const speechInput = event.results[0][0].transcript;

            
        //     fuzzball.ratio(speechInput, script[index].line);
        //     // if the score that the ratio gives is greater than 80, then move onto the next line
        //     console.log('color', speechInput);
        //   };

        //   recognition.onspeechend = () => {
        //     recognition.stop();
        //   };
    }


    
    return (
        <><button style={{ border: "1px solid white"}} onClick={() => start()}>Try STT</button></>
    )
};