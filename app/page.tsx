'use client'

import React from 'react';
import { UploadForm } from './components/UploadForm';
import { Script } from './components/Script';
import { ScriptLineObject } from './components/ScriptLine';
import { LoadingBar } from './components/LoadingBar';
import { ChooseCharacter } from './components/ChooseCharacter';
import { STT } from './components/STT';

export interface ScriptObject {
    lines: ScriptLineObject[]
}

export default function Home() {
    
    // user dependent state variables
    const [script, setScript] = React.useState<ScriptObject>();
    const [showScript, setShowScript] = React.useState<boolean | undefined>(false);
    const [indexOfCurrLine, setIndexOfCurrLine] = React.useState<number>(0);
    const [listOfCharacters, setListOfCharacters] = React.useState<string[]>([]);
    const [selectedCharacter, setSelectedCharacter] = React.useState<string | undefined>("");

    // states to keep track of which apis are loading
    const [isLoading, setIsLoading] = React.useState(false);
    const [parsePDFLoading, setParsePDFLoading] = React.useState<boolean | undefined>(false);
    const [gptLoading, setGPTLoading] = React.useState<boolean | undefined>(false);
    const [ttsLoading, setTTSLoading] = React.useState<boolean | undefined>(false);

    // action state variables
    const [hideUpload, setHideUpload] = React.useState<boolean>(false);
    const [startClicked, setStartClicked] = React.useState<boolean>(false);

    const [countdown, setCountdown] = React.useState<number>(3);
    const [isCounting, setIsCounting] = React.useState(false);

    React.useEffect(() => {
      let countdownInterval: any;
  
      if (countdown > 0) {
        countdownInterval = setInterval(() => {
          setCountdown((prevCount) => prevCount - 1);
        }, 1000);
      }
  
      // Cleanup function to clear the interval when the component is unmounted or when counting is stopped
      return () => {
        clearInterval(countdownInterval);
      };
    }, [isCounting]);


    React.useEffect(() => {
        createAvailableCharacters(script);
    }, [script])

    // we want to iterate through this script, and if the item
    // is a character line, grab the character and append it 
    const createAvailableCharacters = (script: ScriptObject | undefined) => {
        let identifiedCharacters: Set<string> = new Set();

        // we don't want duplicates in the case where the character name is part of 
        // another character's name 
        script ? script.lines.forEach((item) => {
            if ((!item.direction && !item.directions) && item.character) {
                // make sure it's a new name, and one that is not a substring of another (e.g. Girl & Girl (Rachel))
                if (!checkIfNameExistsWithin(item.character, identifiedCharacters)) {
                    identifiedCharacters.add(item.character);
                }
            }
        }) : null;

        let characterArray = Array.from(identifiedCharacters);

        setListOfCharacters(characterArray);
    }

    // helper function to check if a name is part of an already existing identified name 
    // if the new name is longer than the already existing name use the longer one
    const checkIfNameExistsWithin = (newName: string, listOfNames: Set<string>) => {

        if (!listOfNames) return false;

        for (const existingName of listOfNames) {
            if (existingName.includes(newName) || newName.includes(existingName)) {
                // we want the longer one
                if ( newName.length > existingName.length ) {
                    listOfNames.delete(existingName);
                    listOfNames.add(newName);
                }
                return true;
            }
        }
        return false;
    }

    // functions to handle state changes 
    const handleLoading = (loadingState: boolean) => {
        setIsLoading(loadingState);
    }

    const handleDisplayScript = (shouldShowScript: boolean) => {
        setShowScript(shouldShowScript);
    }

    const handleHideForm = (shouldHide: boolean) => {
        setHideUpload(shouldHide);
    }

    const handlePDFLoading = (loading: boolean) => {
        setParsePDFLoading(loading);
    }

    const handleGPTLoading = (loading: boolean) => {
        setGPTLoading(loading);
    }

    const handleTTSLoading = (loading: boolean) => {
        setTTSLoading(loading);
    }

    const handleCharacterChange = (character: string) => {
        setSelectedCharacter(character);
    }    

    const handleIndexUpdate = (index: number) => {
        setIndexOfCurrLine(index);
    }

    const handleClickStart = (click: boolean) => {
        setStartClicked(click);
        setCountdown(3); 
        setIsCounting(true);
    }

    const handleSecondsToPause = (index: number, numOfSeconds: number) => {
        if (script) script.lines[index].pauseSeconds = numOfSeconds;
    }

    return (
        <>  
            <h1 style={{ fontSize: '50px', marginBottom: '50px', display: hideUpload ? 'none' : 'block' }}>Ready Reader</h1>
            <div style={{ display: hideUpload ? 'none' : 'block' }}>
                <UploadForm
                    setTheScript={setScript} 
                    showScript={handleDisplayScript} 
                    hideUpload={handleHideForm}
                    isLoading={handleLoading}
                    isPDFLoading={handlePDFLoading}
                    isGPTLoading={handleGPTLoading}
                    isTTSLoading={handleTTSLoading}
                />
            </div>
            {parsePDFLoading || gptLoading || ttsLoading ? 
                <LoadingBar 
                    parseLoading={parsePDFLoading} 
                    gptLoading={gptLoading} 
                    ttsLoading={ttsLoading}
                /> 
                : <></>}
            {!isLoading && script && !selectedCharacter ? 
                <ChooseCharacter 
					userCharacter={selectedCharacter}
					hasStarted={startClicked}
                    characters={listOfCharacters} 
                    setCharacter={handleCharacterChange} /> 
                : <></>}
            {script && selectedCharacter ?
                <>  
                    {startClicked && countdown > 0 ? 
                        <div className="modal" style={{ display: countdown > 0 ? "block" : "none" }}>
                            <div className="modal-content">
                                <p>{countdown}</p> 
                            </div>
                        </div>
                    : <></>}
                    <Script 
                        scriptToDisplay={script.lines} 
                        currentLineIndex={indexOfCurrLine} 
                        startClicked={startClicked}
                        handleScenePause={handleSecondsToPause}
						handleCurrentLine={handleIndexUpdate}
                        /> 
                    <STT script={script.lines} 
                        userSelectedCharacter={selectedCharacter} 
                        currLineIndex={indexOfCurrLine} 
                        updateIndex={handleIndexUpdate}
                        handleStartClick={handleClickStart}
                        />
                    <ChooseCharacter 
						userCharacter={selectedCharacter}
						hasStarted={startClicked}
                        characters={listOfCharacters} 
                        setCharacter={handleCharacterChange} /> 
                </>
                : <></>}
        </>
    )

}