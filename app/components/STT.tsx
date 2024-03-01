'use client';

import React from 'react';
import { ScriptLineObject } from './ScriptLine';

interface STTProps {
    script: ScriptLineObject[],
    userSelectedCharacter: string,
	currLineIndex: React.MutableRefObject<number>,
    handleStartClick: Function,
	resetState: React.MutableRefObject<boolean>,
	startFromDiffLine: React.MutableRefObject<boolean>
}

export const STT: React.FC<STTProps> = ({ 
    script, 
    userSelectedCharacter, 
    currLineIndex, 
    handleStartClick,
	resetState,
	startFromDiffLine
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

    // Start function will be invoked when the user clicks the button
    const startFunction = () => {

        // console.log('start function called');
        // this points to the parent component to alert the highlighting to start
        handleStartClick(true);
    
        startRef.current = true;
        resetRef.current ? resetRef.current = false : null;

        // set a 3 second timeout before starting the script 
        setTimeout(() => {
			audioContext.resume().then(() => {

				if (startFromDiffLine.current && currLineIndex.current !== 0) {
					startDialogue(currLineIndex.current);
				} else {
					currLineIndex.current = 0;
					startDialogue(0);
				}

			});
        }, 3000);
    }

	// it should essentially reset the whole script to be run as if for the first time
    const reset = () => {
        // console.log('reset called');

        currIndex = 0;
		currLineIndex.current = 0;
		// console.log('CURRENTLINEINDE SHOULD BE 0', currLineIndex.current);
		resetState.current = true;
		startFromDiffLine.current = false;
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

		// if reset is ever true, we should stop playing
		if (resetRef.current) {
			// console.log('application should stop');
			return;
		}

        currIndex = indexOfTheCurrentLine;

        const newRecognition = new SpeechRecognition();
        
        if (currIndex >= script.length) {
            // console.log('reached end of script');

			stopSpeechRecognition();
			stopAudioSound();

            return;
        }

        const currentLine = script[currIndex];

        // if current line is a scene direction, we skip
        if (currentLine.direction || currentLine.directions) {
            // console.log('hit scene direction so skip');

            const numOfSecondsToPause = script[currIndex].pauseSeconds;

            // number of seconds should be only defined if the property is there
            const secondsToPause = numOfSecondsToPause ?  numOfSecondsToPause * 1000 : 0;

            setTimeout(() => {
                currIndex++;
				currLineIndex.current = currIndex;
                startDialogue(currIndex);
                return;
            }, secondsToPause);
            
        } else if (currentLine.character?.includes(userSelectedCharacter)
            || userSelectedCharacter.includes(currentLine.character!)) {

                // console.log('entered user block');
				// in the case that we enter the speech recognition block, we make sure that any audio sound is turned off 
				stopAudioSound();

                newRecognition.onresult = (e: any) => {
                    const transcript = e.results[0][0].transcript.toLowerCase().replace(/\s/g, '');
                    // console.log('transcribed: ', transcript);

                    checkInputAgainstScript(transcript);
                }

                newRecognition.onend = (e: any) => {
                    // console.log('speech recognition ended');
					newRecognition.stop();
                }

                newRecognition.continuous = true;
                newRecognition.start();

				speechRecognitionRef.current = newRecognition;

                // console.log('listening...');
                return;
        } else {
            // console.log('entered moby block');

			// in the case that we enter Moby block, we want to stop any speech recognition
			stopSpeechRecognition();
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
        if (score > 60) {
            currIndex++;
			currLineIndex.current = currIndex;
            startDialogue(currIndex);
        } else {
            // console.log('try again');
			
			stopSpeechRecognition(); // Stop recognition on mismatch
			stopAudioSound(); // stop any audio from playing 

			// TODO: some kind of try again alert
			const newRecognition = new SpeechRecognition();

			newRecognition.onresult = (e: any) => {
				const transcript = e.results[0][0].transcript.toLowerCase().replace(/\s/g, '');
				// console.log('transcribed: ', transcript);

				checkInputAgainstScript(transcript);
			}

			newRecognition.onend = (e: any) => {
				// console.log('speech recognition ended');
				newRecognition.stop();
			}

			newRecognition.continuous = true;
			newRecognition.start();

			speechRecognitionRef.current = newRecognition;

			return;
        }

        return;
    }   

    const playAudioBuffer = (audioBuffer: AudioBuffer) => {

        const outputSource = audioContext.createBufferSource();
        outputSource.connect(audioContext.destination);
        outputSource.buffer = audioBuffer;

        outputSource.addEventListener('ended', () => {
            // console.log('moby turn over');

            currIndex++;
			currLineIndex.current = currIndex;
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

        // console.log('entered audio player');

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
        <div style={{ margin: "10px auto" }}>
            <button 
                style={{ border: '1px solid white', padding: "10px 25px", borderRadius: "5px" }} 
                onClick={() => startRef.current ? reset() : startFunction()}>
                {startRef.current ? "RESET" : "START"}
            </button>
        </div>
    )
};