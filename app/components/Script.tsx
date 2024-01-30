'use client'

import { useState } from "react";
import { ScriptLine, ScriptLineObject } from './ScriptLine';
import { ScriptObject } from '../page';

interface ScriptProps {
    scriptToDisplay: ScriptLineObject[]
}

export const Script: React.FC<ScriptProps> = ({ scriptToDisplay }) => {

    // given the script object
    // we want to traverse through the object, and then for each
    // item, we pass the values into the ScriptLine object

    // const script = lines.map(async (line, id) => {
    //     console.log('line', line);

    //     return <ScriptLine 
    //                 key={id} 
    //                 direction={line.direction ? line.direction : line.directions} 
    //                 character={line.character} 
    //                 line={line.line} 
    //                 audioBuffer={line.audioBuffer}
    //             />
    // })

    // return (
    //     <div>
    //         {lines.map((line, id) => {
    //             console.log('line', line);

    //             return <ScriptLine 
    //                 key={id} 
    //                 direction={line.direction ? line.direction : line.directions} 
    //                 character={line.character} 
    //                 line={line.line} 
    //                 audioBuffer={line.audioBuffer}/>
    //         })}
    //     </div>
    // )
    return (
        <div>
            {scriptToDisplay.map((line, id) => {
                console.log('line', line);
                return <ScriptLine 
                    key={id}
                    direction={line.direction ? line.direction : line.directions}
                    character={line.character}
                    line={line.line}
                    audioBuffer={line.audioBuffer}/>
            })}
        </div>
    )

    // return <>{script}</>
}