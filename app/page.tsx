"use client"

import React from 'react';
// import { UploadForm, ScriptObject } from './components/UploadForm';
import { UploadForm } from './components/UploadForm';
import { Script } from './components/Script';
import { ScriptLineObject } from './components/ScriptLine';
import { LoadingBar } from './components/LoadingBar';
import { ChooseCharacter } from './components/ChooseCharacter';

export interface ScriptObject {
    lines: ScriptLineObject[]
}

export default function Home() {
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [script, setScript] = React.useState<ScriptObject>();
    const [showScript, setShowScript] = React.useState<boolean | undefined>(false);

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

        script ? script.lines.forEach((item) => {
            if ((!item.direction && !item.directions) && item.character) {
                if(!identifiedCharacters.has(item.character)) {
                    identifiedCharacters.add(item.character);
                }
            }
        }) : null;

        // do better error handling here ^

        let characterArray = Array.from(identifiedCharacters);

        setListOfCharacters(characterArray);
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
        console.log('character chosen: ', selectedCharacter);
        setSelectedCharacter(character);
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
            {!isLoading && script ? 
                <ChooseCharacter 
                    characters={listOfCharacters} 
                    setCharacter={handleCharacterChange} /> 
                : <></>}
            {script && selectedCharacter? 
                <Script 
                    scriptToDisplay={script.lines} 
                    selectedCharacter={selectedCharacter} /> 
                : <></>}
        </>
    )

}