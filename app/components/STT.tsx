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

    const startRef = React.useRef(false);
    
    const resetRef = React.useRef(false);

    let stopAudio = false;

    // useRef is primarily used to access and manipulate the DOM or to store mutable values that don't trigger re-renders. 
    // because we don't want this to exactly re-render anything, we'll use ref
    const shouldContinueRef = React.useRef(true);

    // console.log('start? ', startRef.current);
    // console.log('user clicked reset? ', resetRef.current);
    // console.log('shouldContinue value', shouldContinueRef.current);

    // Start function will be invoked when the user clicks the button
    // it should essentially reset the whole script to be run as if for the first time
    const startFunction = () => {
        console.log('start function called');
        // let the parent component know that it has started.
        handleStartClick(true);
        
        // set state variable as started
        // setUserHasStarted(true);    
        startRef.current = true;
        resetRef.current = false;
        shouldContinueRef.current = true;

        startDialogue(0);
    }

    const reset = () => {
        console.log('reset called');

        // set the indices to 0
        currIndex = 0;
        updateIndex(0);

        shouldContinueRef.current = false;
        resetRef.current = true;
    }

    const startDialogue = ( indexOfTheCurrentLine: number ) => {

        // console.log('what is shouldContinue', shouldContinueRef.current);
        if (!shouldContinueRef.current) {
            // if shouldContinue is false 
            // we should return
            console.log('play function should be stopped');
            return;
        } 

        // otherwise we continue playing the thing 

        currIndex = indexOfTheCurrentLine;

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
        // console.log('current line object: ', currentLine);
        // console.log('current line: ', currentLine.line);

        // if current line is a scene direction, we skip
        if (currentLine.direction || currentLine.directions) {
            console.log('hit scene direction so skip');
            currIndex++;
            updateIndex(currIndex);
            startDialogue(currIndex);
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
            // startDialogue();
            startDialogue(currIndex);
        } else {
            console.log('try again');
            // TODO: some form of try again alert 
            // startDialogue();
            startDialogue(currIndex);
        }

        return;
    }   

    const playAudioBuffer = (audioBuffer: AudioBuffer) => {
        outputSource = audioContext.createBufferSource();
        outputSource.connect(audioContext.destination);
        outputSource.buffer = audioBuffer;
        outputSource.start();

        // TODO: need to be able to stop streaming the sound when the reset is clicked..
        // when reset is clicked, outputSource.stop();


        outputSource.addEventListener('ended', () => {
            console.log('moby turn over');

            currIndex++;
            updateIndex(currIndex);
            // startDialogue();
            startDialogue(currIndex);
        }); 
    }

    // helper function to stream the audioBuffer object 
    const playAudioSound = async (audioBuffer: AudioBuffer | undefined) => {

        console.log('entered audio player');

        if (!audioBuffer) return null;

        try {
            if (await audioBuffer.length > 0) {
                playAudioBuffer(audioBuffer);
            }
        } catch (e: any) {
            console.error(e);
        }

        return;
    }
    
    React.useEffect(() => {
        if (resetRef.current) {
            // startDialogue(0, 0);
            // setShouldContinue(true);
            // setUserHasStarted(false);
            startRef.current = false;
            updateIndex(0);
            stopAudio = true;
            // shouldContinueRef.current = true;
        }
    }, [resetRef.current])
    
    return (
        <>
            <button 
                style={{ border: '1px solid white'}} 
                onClick={() => startRef.current ? reset() : startFunction()}>
                {startRef.current ? "Reset" : "Start"}
                {/* onClick={() => startFunction()}> */}
                {/* Start */}
            </button>
        </>
    )
};