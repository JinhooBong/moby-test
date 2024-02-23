'use client'

import { ScriptLine, ScriptLineObject } from './ScriptLine';
import React from "react";

export interface ScriptProps {
    scriptToDisplay: ScriptLineObject[],
    currentLineIndex: number,
    startClicked: boolean,
    handleScenePause: Function
}

export const Script: React.FC<ScriptProps> = ({ 
	scriptToDisplay, 
	currentLineIndex, 
	startClicked,
	handleScenePause 
}) => {

	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		// Scroll to the currently read line when it changes
		if (containerRef.current) {
		  const lineElement = containerRef.current.children[currentLineIndex];
		  if (lineElement) {
			lineElement.scrollIntoView({
			  behavior: 'smooth',
			  block: 'center',
			});
		  }
		}
	  }, [currentLineIndex]);

    return (
        <div ref={containerRef} style={{ height: "85vh", overflowY: "auto", width: "70vw", maxWidth: "800px" }}>
            {scriptToDisplay.map((line, id) => {
                return <ScriptLine 
                    key={id}
                    index={id}
                    startClicked={startClicked}
                    currLineIndex={currentLineIndex}
                    direction={line.direction ? line.direction : line.directions}
                    character={line.character}
                    line={line.line}
                    audioBuffer={line.audioBuffer}
                    addScenePauses={handleScenePause}
                    />
            })}
        </div>
    )
}