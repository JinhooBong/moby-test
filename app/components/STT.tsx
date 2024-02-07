"use client";

// const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
// const fetch = require("cross-fetch");

import React from 'react';
import { ScriptLineObject } from './ScriptLine';

interface STTProps {
    script: ScriptLineObject[],
    userSelectedCharacter: string,
    index: number,
    updateIndex: Function,
    handleStartClick: Function
}

/* --------------------------------------------------------------------------- 

    CERTAIN SCRIPTS - will not be able to read the last couple lines because of 
    TTS API limitations. Should be solved if we upgrade to paid tier 

 --------------------------------------------------------------------------- */

// input: the script, and the starting index of the script 
// we want to check to make sure that the input from the speech recognition matches the script at index..
// if it matches, and the next line is still the reader, then we want to still check otherwise we just increment until it is the reader's turn again.

export const STT: React.FC<STTProps> = ({ script, userSelectedCharacter, index, updateIndex, handleStartClick }) => {

    const fuzzball = require('fuzzball');
    const SpeechRecognition: any = window.SpeechRecognition || window.webkitSpeechRecognition;

    // let currIndex = index;
    let currIndex = 0;

    console.log('script.length', script.length);

    const startFunction = () => {
        handleStartClick(true);

        startDialogue();
    }

    const startDialogue = () => {

        console.log('current index', currIndex);
        console.log('index', index);
        console.log('user selected character', userSelectedCharacter);

        const newRecognition = new SpeechRecognition();
        
        if (currIndex >= script.length) {
            console.log('reached end of script');
            const endRecognition = new SpeechRecognition();
            endRecognition.start();
            endRecognition.stop();
            return;
        }

        const currentLine = script[currIndex];
        console.log('what is currentline', currentLine);

        // if current line is a scene direction, we skip
        if (currentLine.direction || currentLine.directions) {
            console.log('hit scene direction so skip');
            currIndex++;
            updateIndex(currIndex);
            startDialogue();
            return;
        } else if (currentLine.character?.includes(userSelectedCharacter)
            || userSelectedCharacter.includes(currentLine.character!)) {

                console.log('enter user block');
                newRecognition.onresult = (e: any) => {
                    const transcript = e.results[0][0].transcript.toLowerCase().replace(/\s/g, '');
                    console.log('transcribed: ', transcript);
    
                    checkInputAgainstScript(transcript, currentLine.line!);
                }

                newRecognition.onend = (e: any) => {
                    console.log('speech recognition ended');
                }

                newRecognition.continuous = true;
                newRecognition.start();

                console.log('listening...');
                return;
        } else {
            console.log('enters moby block');
            console.log('the current line', currentLine.line);
            // console.log('current audio', currentLine.audioBuffer);
            playAudioBuffer(currentLine.audioBuffer);
            return;
        }
    }

    // const checkInputAgainstScript = (currIndex:number, speechInput: string) => {
    const checkInputAgainstScript = (transcribed: string, scriptLine: string) => {
        const score = fuzzball.ratio(transcribed, script[currIndex].line);
        console.log('score', score);
        if (score > 70) {
            currIndex++;
            updateIndex(currIndex);
            startDialogue();
        } else {
            startDialogue();
        }

        return;
    }

    // helper function to stream the audioBuffer object 
    const playAudioBuffer = async (audioBuffer: Buffer | undefined) => {
        // console.log('what is this', audioBuffer);
        // console.log('type', typeof audioBuffer);

        console.log('entered audio player');

        let audioContext = new AudioContext();
        let outputSource;
    
        if (!audioBuffer) return null;
    
        try {
            if (await audioBuffer.byteLength > 0) {
                console.log('audioBuffer', audioBuffer);
                console.log('audioBuffer', audioBuffer.buffer);
                audioContext.decodeAudioData(await audioBuffer.buffer, (buffer) => {
                    audioContext.resume();
                    outputSource= audioContext.createBufferSource();
                    outputSource.connect(audioContext.destination);
                    outputSource.buffer = buffer;
                    outputSource.start(0);

                    outputSource.addEventListener("ended", () => {
                        console.log('moby turn over');

                        currIndex++;
                        updateIndex(currIndex);
                        startDialogue();
                    });
                })
            } else {
                console.error("did not find any arguments");
            }
        } catch (e: any) {
            console.error(e);
        }
        return;
    }
    
    return (
        <>
            <button 
                style={{ border: "1px solid white"}} 
                onClick={() => startFunction()}>
                Start
            </button>
        </>
    )
};