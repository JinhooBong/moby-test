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

    TODO: 
        #1 - certain lines are being repeated and played in the middle of it being played
        the first time around, and lines are being skipped where the user is supposed to speak
        -- WE NEED THIS TO BE 100% readable.. no mistkaes

        #2 [x] - adding a toggle for scene directions to add pause inputs 

        #3 [x] - add a delay in the beginning when the user clicks "start", maybe showing a countdown of some sorts 

        #4 [x] - having the capability to switch the character that the user has selected (after the initial selection period)

        #5 [x] - fix the issue where loading bar goes over 100
    
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

    // useRef is primarily used to access and manipulate the DOM or to store mutable values that don't trigger re-renders. 
    // because we don't want this to exactly re-render anything, we'll use ref
    const shouldContinueRef = React.useRef(true);

    console.log('start? ', startRef.current);
    console.log('user clicked reset? ', resetRef.current);
    console.log('shouldContinue value', shouldContinueRef.current);

    // Start function will be invoked when the user clicks the button
    // it should essentially reset the whole script to be run as if for the first time
    const startFunction = () => {

        console.log('start function called');
        // this points to the parent component to alert the highlighting to start
        handleStartClick(true);

        updateIndex(0);
    
        startRef.current = true;
        // if resetRef is set to true, then set it to false, otherwise don't touch
        resetRef.current ? resetRef.current = false : null;
        shouldContinueRef.current = true;

        // set a 3 second timeout before starting the script 
        setTimeout(() => {
            startDialogue(0);
        }, 3000);
    }

    const reset = () => {
        console.log('reset called');

        currIndex = 0;
        updateIndex(0);
        handleStartClick(false);

        // startRef.current = true;
        startRef.current = false;
        shouldContinueRef.current = false;
        resetRef.current = true;
    }

    const startDialogue = ( indexOfTheCurrentLine: number ) => {

        console.log('INSIDE start? ', startRef.current);
        console.log('INSIDE user clicked reset? ', resetRef.current);
        console.log('INSIDE shouldContinue value', shouldContinueRef.current);
        if (!shouldContinueRef.current) {
            // if shouldContinue is false 
            // we should return
            console.log('play function should be stopped');
            return;
        } 

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

            const numOfSecondsToPause = script[currIndex].pauseSeconds;

            // number of seconds should be only defined if the property is there
            const secondsToPause = numOfSecondsToPause ?  numOfSecondsToPause * 1000 : 0;

            setTimeout(() => {
                currIndex++;
                updateIndex(currIndex);
                startDialogue(currIndex);
                return;
            }, secondsToPause);
            
        } else if (currentLine.character?.includes(userSelectedCharacter)
            || userSelectedCharacter.includes(currentLine.character!)) {

                console.log('entered user block');
                newRecognition.onresult = (e: any) => {
                    const transcript = e.results[0][0].transcript.toLowerCase().replace(/\s/g, '');
                    console.log('transcribed: ', transcript);

                    checkInputAgainstScript(transcript);
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

    const checkInputAgainstScript = (transcribed: string) => {

        const scriptLineWithoutParenthesis = script[currIndex].line?.replace(/ *\([^)]*\) */g, "");

        const score = fuzzball.ratio(transcribed, scriptLineWithoutParenthesis);
        if (score > 70) {
            currIndex++;
            updateIndex(currIndex);
            startDialogue(currIndex);
        } else {
            console.log('try again');
            // TODO: some form of try again alert 
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

        // if (resetRef.current) outputSource.stop();

        // outputSource.stop() SHOULD stop the audio even if it's midway 
        // according to documentation
        // HOWEVER, it won't recognize that the reset button has been clicked

        outputSource.addEventListener('ended', () => {
            console.log('moby turn over');

            currIndex++;
            updateIndex(currIndex);
            startDialogue(currIndex);
        }); 
    }

    // helper function to stream the audioBuffer object 
    const playAudioSound = async (audioBuffer: AudioBuffer | undefined) => {

        console.log('entered audio player');

        console.log('audioBuffer', audioBuffer);
        console.log('current line', script[currIndex].line);

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
            startRef.current = false;
        }
    }, [resetRef.current])
    
    return (
        <>
            <button 
                style={{ border: '1px solid white'}} 
                onClick={() => startRef.current ? reset() : startFunction()}>
                {startRef.current ? "Reset" : "Start"}
            </button>
        </>
    )
};