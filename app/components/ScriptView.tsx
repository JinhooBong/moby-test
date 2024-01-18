'use client'

import { useState } from 'react';
import { ScriptLine } from './ScriptLine';
import { ScriptLineObject } from './ScriptLine';
import { ScriptObject } from './UploadForm';

export const ScriptView: React.FC<ScriptObject> = ({lines}) => {

    console.log('scriptasdf', lines)
    // script is an object
    // script.script.lines will be the array of objects
    /* 
        {
            "script": {
                "lines": [
                    {
                        "character": "GIRL",
                        "line": "Thomas."
                    },
                    {
                        "directions": "Tom freezes."
                    },
                    {
                        "character": "TOM",
                        "line": "Rachel? What are you doing here?"
                    },
                    {
                        "character": "GIRL (RACHEL)",
                        "line": "I’m here to help you."
                    },
                    {
                        "character": "TOM",
                        "line": "Help me how?"
                    },
                    {
                        "character": "RACHEL",
                        "line": "First, put down the plate."
                    },
                    {
                        "directions": "Tom slowly obliges."
                    },
                    {
                        "character": "RACHEL",
                        "line": "Now come here and sit down."
                    },
                    {
                        "directions": "Tom sits next to the young girl. Paul and Mckenzie sit on either side of them."
                    },
                    {
                        "character": "RACHEL",
                        "line": "The key is not to panic."
                    },
                    {
                        "character": "TOM",
                        "line": "I think I’m gonna be sick."
                    },
                    {
                        "character": "RACHEL",
                        "line": "Drink this."
                    },
                    {
                        "directions": "She hands him a glass of water. Tom drinks it down."
                    },
                    {
                        "character": "MCKENZIE",
                        "line": "What is that?"
                    },
                    {
                        "character": "RACHEL",
                        "line": "Vodka."
                    },
                    {
                        "character": "TOM",
                        "line": "More."
                    },
                    {
                        "directions": "He gulps another down."
                    },
                    {
                        "character": "TOM",
                        "line": "Does Mom know you’re here? It’s gotta be past 10."
                    }
                ]
            }
    }
        
    
    */

    // script.script has the array of objects

    // given the script object
    // we want to traverse through the object, and then for each
    // item, we want to put it into a paragraph JSX element


    const script = lines.map((line, id) => {
        return <ScriptLine key={id} direction={line.direction ? line.direction : line.directions} character={line.character} line={line.line} />
    })
    return <>{script}</>
}