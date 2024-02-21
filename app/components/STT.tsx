'use client';

import React from 'react';
import { ScriptLineObject } from './ScriptLine';
import { Newsreader } from 'next/font/google';

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
        -- WE NEED THIS TO BE 100% readable.. no mistakes
		- lines are no longer being skipped [x]
		- lines are not being replayed in the middle of the initial run [x]

		[edge case] - there are still instances where the script loads WITHOUT audio objects appended..
		we CANNOT have that happen

        #2 [x] - adding a toggle for scene directions to add pause inputs 

        #3 [x] - add a delay in the beginning when the user clicks "start", maybe showing a countdown of some sorts 

        #4 [x] - having the capability to switch the character that the user has selected (after the initial selection period)

        #5 [x] - fix the issue where loading bar goes over 100

		#6 [] - fix the loading bar to actually mimic the loading api?
    
		#7 [x] - the character selection tool should have the chosen character as default value 
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

	/* 
		Ensure that the audioContext is created only once when the component mounts. Currently, a new AudioContext is created every time the component renders, which might lead to unexpected behavior.
		By using useMemo, you ensure that the audioContext is created only once when the component mounts.
	*/
	const audioContext = React.useMemo(() => new AudioContext(), []);

	const outputSourceRef = React.useRef<AudioBufferSourceNode>();
	const speechRecognitionRef = React.useRef<SpeechRecognition>();

    let currIndex = 0;

    const startRef = React.useRef(false);
    
    const resetRef = React.useRef(false);

    // useRef is primarily used to access and manipulate the DOM or to store mutable values that don't trigger re-renders. 

    // console.log('start? ', startRef.current);
    // console.log('user clicked reset? ', resetRef.current);
    // console.log('shouldContinue value', shouldContinueRef.current);

    // Start function will be invoked when the user clicks the button
    const startFunction = () => {

        console.log('start function called');
        // this points to the parent component to alert the highlighting to start
        handleStartClick(true);

        updateIndex(0);
    
        startRef.current = true;
        // if resetRef is set to true, then set it to false, otherwise don't touch
        resetRef.current ? resetRef.current = false : null;

        // set a 3 second timeout before starting the script 
        setTimeout(() => {
			audioContext.resume().then(() => {
				startDialogue(0);
			});
        }, 3000);
    }

	// it should essentially reset the whole script to be run as if for the first time
    const reset = () => {
        console.log('reset called');

        currIndex = 0;
        updateIndex(0);
        handleStartClick(false);
		
		// stop the audio and / or speech recognition upon reset
		stopAudioSound();
		stopSpeechRecognition();

		// when the user clicks reset
		// the start should be set to false
		// reset should be set to true
        startRef.current = false;
        resetRef.current = true;
    }

    const startDialogue = ( indexOfTheCurrentLine: number ) => {

        console.log('INSIDE start? ', startRef.current);
        console.log('INSIDE user clicked reset? ', resetRef.current);

		// if reset is ever true, we should stop playing
		if (resetRef.current) {
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

				// if reset is clicked, we want the recognition to instantly stop listening
				// because the audio being played gets affected 
				// ^ this seems like an edge case... sometimes it affects the headphone audio, sometimes it doesn't

                newRecognition.onresult = (e: any) => {
                    const transcript = e.results[0][0].transcript.toLowerCase().replace(/\s/g, '');
                    console.log('transcribed: ', transcript);

                    checkInputAgainstScript(transcript);
                }

                newRecognition.onend = (e: any) => {
                    console.log('speech recognition ended');
					newRecognition.stop();
                }

                newRecognition.continuous = true;
                newRecognition.start();

				speechRecognitionRef.current = newRecognition;

                console.log('listening...');
                return;
        } else {
            console.log('entered moby block');
            playAudioSound(currentLine.audioBuffer);
            return;
        }
    }

	const stopSpeechRecognition = () => {
		if (speechRecognitionRef.current) {
			speechRecognitionRef.current.stop();
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
			alert("try again");
            startDialogue(currIndex);
        }

        return;
    }   

    const playAudioBuffer = (audioBuffer: AudioBuffer) => {
		console.log('hits');

        const outputSource = audioContext.createBufferSource();
        outputSource.connect(audioContext.destination);
        outputSource.buffer = audioBuffer;

        outputSource.addEventListener('ended', () => {
            console.log('moby turn over');

            currIndex++;
            updateIndex(currIndex);
            startDialogue(currIndex);
        }); 

        outputSource.start(0);
		outputSourceRef.current = outputSource;
    }

	const stopAudioSound = () => {
		if (outputSourceRef.current) {
			outputSourceRef.current.stop();
			outputSourceRef.current.disconnect();
		}
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