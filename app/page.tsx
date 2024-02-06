"use client"

import React from 'react';
// import { UploadForm, ScriptObject } from './components/UploadForm';
import { UploadForm } from './components/UploadForm';
import { Script } from './components/Script';
import { ScriptLineObject } from './components/ScriptLine';
import { LoadingBar } from './components/LoadingBar';
import { ChooseCharacter } from './components/ChooseCharacter';
import { STT } from "./components/STT";

export interface ScriptObject {
    lines: ScriptLineObject[]
}

export default function Home() {
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [script, setScript] = React.useState<ScriptObject>();
    const [showScript, setShowScript] = React.useState<boolean | undefined>(false);
    const [indexOfCurrLine, setIndexOfCurrLine] = React.useState<number>(0);

    const [listOfCharacters, setListOfCharacters] = React.useState<string[]>([]);
    const [selectedCharacter, setSelectedCharacter] = React.useState<string | undefined>("");

    // states to keep track of which apis are loading
    const [parsePDFLoading, setParsePDFLoading] = React.useState<boolean | undefined>(false);
    const [gptLoading, setGPTLoading] = React.useState<boolean | undefined>(false);
    const [ttsLoading, setTTSLoading] = React.useState<boolean | undefined>(false);

    const [hideUpload, setHideUpload] = React.useState<boolean>(false);


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

        // do better error handling here ^

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

    return (
        <>  
            {console.log('script', script)}
            <div style={{ display: hideUpload ? "none" : "block" }}>
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
                    characters={listOfCharacters} 
                    setCharacter={handleCharacterChange} /> 
                : <></>}
            {script && selectedCharacter ?
                <> 
                    <Script 
                        scriptToDisplay={script.lines} /> 
                    <STT script={script.lines} 
                        userSelectedCharacter={selectedCharacter} 
                        index={indexOfCurrLine} />
                </>
                : <></>}
        </>
    )

}