'use client';

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

export const STT: React.FC<STTProps> = ({ 
    script, 
    userSelectedCharacter, 
    index, 
    updateIndex, 
    handleStartClick 
}) => {

    const fuzzball = require('fuzzball');
    const SpeechRecognition: any = window.SpeechRecognition || window.webkitSpeechRecognition;

    let audioContext = new AudioContext();
    let outputSource;

    let currIndex = 0;

    const [userHasStarted, setUserHasStarted] = React.useState(false);
    const [userClickedReset, setUserClickedReset] = React.useState(false);

    console.log('script.length', script.length);

    const startFunction = () => {
        handleStartClick(true);
        setUserHasStarted(true);
        setUserClickedReset(false);

        startDialogue();
    }

    const startDialogue = () => {
        console.log('reset clicked', userClickedReset);

        if (userClickedReset) return;

        console.log('current index: ', currIndex);
        console.log('index: ', index);
        console.log('user selected character: ', userSelectedCharacter);

        const newRecognition = new SpeechRecognition();
        
        if (currIndex >= script.length) {
            console.log('reached end of script');
            const endRecognition = new SpeechRecognition();
            endRecognition.start();
            endRecognition.stop();
            return;
        }

        const currentLine = script[currIndex];
        console.log('current line object: ', currentLine);
        console.log('current line: ', currentLine.line);

        // if current line is a scene direction, we skip
        if (currentLine.direction || currentLine.directions) {
            console.log('hit scene direction so skip');
            currIndex++;
            updateIndex(currIndex);
            startDialogue();
            return;
        } else if (currentLine.character?.includes(userSelectedCharacter)
            || userSelectedCharacter.includes(currentLine.character!)) {

                console.log('entered user block');
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
            console.log('entered moby block');
            // console.log('current audio', currentLine.audioBuffer);
            playAudioSound(currentLine.audioBuffer);
            return;
        }
    }

    const checkInputAgainstScript = (transcribed: string, scriptLine: string) => {
        const score = fuzzball.ratio(transcribed, script[currIndex].line);
        // console.log("score", score);
        if (score > 70) {
            currIndex++;
            updateIndex(currIndex);
            startDialogue();
        } else {
            console.log('try again');
            // TODO: some form of try again alert 
            startDialogue();
        }

        return;
    }

    const playAudioBuffer = (audioBuffer: AudioBuffer) => {
        outputSource = audioContext.createBufferSource();
        outputSource.connect(audioContext.destination);
        outputSource.buffer = audioBuffer;
        outputSource.start();

        outputSource.addEventListener('ended', () => {
            console.log('moby turn over');

            currIndex++;
            updateIndex(currIndex);
            startDialogue();
        }); 

    }

    // helper function to stream the audioBuffer object 
    const playAudioSound = async (audioBuffer: Buffer | undefined) => {

        console.log('entered audio player');

    
        if (!audioBuffer) return null;
    
        // try {
        //     if (await audioBuffer.byteLength > 0) {
        //         // console.log("audioBuffer", audioBuffer);
        //         // console.log("audioBuffer", audioBuffer.buffer);
        //         audioContext.decodeAudioData(await audioBuffer.buffer, (buffer) => {
        //             audioContext.resume();
        //             outputSource= audioContext.createBufferSource();
        //             outputSource.connect(audioContext.destination);
        //             outputSource.buffer = buffer;
        //             outputSource.start(0);

        //             outputSource.addEventListener('ended', () => {
        //                 console.log('moby turn over');

        //                 currIndex++;
        //                 updateIndex(currIndex);
        //                 startDialogue();
        //             });
        //         })
        //     } else {
        //         console.error('did not find any arguments in audio player');
        //     }
        // } catch (e: any) {
        //     console.error(e);
        // }

        try {
            if (await audioBuffer.byteLength > 0) {
                audioContext.decodeAudioData(await audioBuffer.buffer, playAudioBuffer);
            }
        } catch (e: any) {
            console.error(e);
        }

        return;
    }

    /* 
        When we reset, we want to set the current index to 0, and the parent variable (index) to 0
        essentially to reset the start of the script
        we have a variable to check if the user has clicked reset
        if the user has clicked reset, we want to stop the call stack (initiated when the user clicked start)
        and then start from the beginning 
    */ 

    const handleResetClick = (clicked: boolean) => {
        setUserClickedReset(clicked);
    }

    // const reset = () => {

    //     currIndex = 0;
    //     updateIndex(0);
    //     // setUserClickedReset(true);
    //     handleResetClick(true);

    //     // startFunction();
    //     startDialogue();
    // }
    
    return (
        <>
            <button 
                style={{ border: '1px solid white'}} 
                // onClick={() => userHasStarted ? reset() : startFunction()}>
                // {userHasStarted ? "Restart" : "Start"}
                onClick={() => startFunction()}>
                Start
            </button>
        </>
    )
};