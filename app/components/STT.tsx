"use client";

// const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
// const fetch = require("cross-fetch");


// input: the script, and the starting index of the script 
// we want to check to make sure that the input from the speech recognition matches the script at index..
// if it matches, and the next line is still the reader, then we want to still check otherwise we just increment
// until it is the reader's turn again.
import React from 'react';
import { ScriptLineObject } from './ScriptLine';

interface STTProps {
    script: ScriptLineObject[],
    userSelectedCharacter: string,
    index: number,
    updateIndex: Function
}

const playAudioBuffer = (audioBuffer: Buffer | undefined) => {
    console.log('what is this', audioBuffer);
    console.log('type', typeof audioBuffer);

    let audioContext = new AudioContext();

    if (!audioBuffer) return null;

    try {
        if (audioBuffer.byteLength > 0) {
            console.log('here');
            audioContext.decodeAudioData(audioBuffer.buffer, (buffer) => {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start();
            })
        } else {
            console.error("did not find any arguments");
        }
    } catch (e: any) {
        console.error(e);
    }

}

export const STT: React.FC<STTProps> = ({ script, userSelectedCharacter, index, updateIndex }) => {

    const fuzzball = require('fuzzball');

    const [transcribed, setTranscribed] = React.useState('');

    // we check to see which line we're currently on
    // if the line that we're currently on is a scene direction, we increment until the line is not a scene line
    
    const start = () => {

        console.log('current index', index);
        console.log('user selected character', userSelectedCharacter);

        // if the current line is a scene direction, we skip 
        if ( script[index].direction || script[index].directions ) {
            updateIndex(index+1);
            start();
        } else if ( script[index].character !== userSelectedCharacter ) {
            // if the current line is not a line that the user should read, we should play the audio
            // script[index].audioBuffer ? playAudioBuffer(script[index].audioBuffer) : console.log('audio not found');
            console.log('audio found', script[index].audioBuffer);
            // playAudioBuffer(script[index].audioBuffer);
            updateIndex(index+1);
            start();
        } else {
            // otherewise we wait for the user to speak the line and we check to see 
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
        <><button style={{ border: "1px solid white"}} onClick={() => start()}>Start</button></>
    )
};