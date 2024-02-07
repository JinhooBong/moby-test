'use client'

import { ScriptLine, ScriptLineObject } from './ScriptLine';

export interface ScriptProps {
    scriptToDisplay: ScriptLineObject[],
    currentLineIndex: number,
    startClicked: boolean
}

export const Script: React.FC<ScriptProps> = ({ scriptToDisplay, currentLineIndex, startClicked }) => {

    return (
        <div style={{ height: "85vh", overflowY: "auto"}}>
            {scriptToDisplay.map((line, id) => {
                return <ScriptLine 
                    key={id}
                    index={id}
                    startClicked={startClicked}
                    currLineIndex={currentLineIndex}
                    direction={line.direction ? line.direction : line.directions}
                    character={line.character}
                    line={line.line}
                    audioBuffer={line.audioBuffer}/>
            })}
        </div>
    )
}