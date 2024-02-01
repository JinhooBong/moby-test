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
    index: number
}

export const STT: React.FC<STTProps> = ({ script, index}) => {

    const trySTT = () => {
        const SpeechRecognition: any = window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();

        recognition.start();

        recognition.onresult = (event: any) => {
            const color = event.results[0][0].transcript;
            console.log('color', color);
          };

          recognition.onspeechend = () => {
            recognition.stop();
          };
    }
    
    return (
        <><button style={{ border: "1px solid white"}} onClick={() => trySTT()}>Try STT</button></>
    )
};