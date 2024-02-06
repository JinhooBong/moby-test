'use client'

import { ScriptLine, ScriptLineObject } from './ScriptLine';

export interface ScriptProps {
    scriptToDisplay: ScriptLineObject[],
}

export const Script: React.FC<ScriptProps> = ({ scriptToDisplay }) => {

    return (
        <div style={{ height: "85vh", overflowY: "auto"}}>
            {scriptToDisplay.map((line, id) => {
                return <ScriptLine 
                    key={id}
                    direction={line.direction ? line.direction : line.directions}
                    character={line.character}
                    line={line.line}
                    audioBuffer={line.audioBuffer}/>
            })}
        </div>
    )
}