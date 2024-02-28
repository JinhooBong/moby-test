'use client'

import { ScriptLine, ScriptLineObject } from './ScriptLine';
import React from "react";

export interface ScriptProps {
    scriptToDisplay: ScriptLineObject[],
    // currentLineIndex: number,
	currentLineIndex: React.MutableRefObject<number>,
    startClicked: boolean,
    handleScenePause: Function,
	// handleCurrentLine: Function
	resetButton: React.MutableRefObject<boolean>,
	startFromDiffLine: React.MutableRefObject<boolean>
}

export const Script: React.FC<ScriptProps> = ({ 
	scriptToDisplay, 
	currentLineIndex, 
	startClicked,
	handleScenePause,
	resetButton,
	startFromDiffLine
	// handleCurrentLine
}) => {

	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		// Scroll to the currently read line when it changes
		if (containerRef.current) {
		  const lineElement = containerRef.current.children[currentLineIndex.current];
		  if (lineElement) {
			lineElement.scrollIntoView({
			  behavior: 'smooth',
			  block: 'center',
			});
		  }
		}
	  }, [currentLineIndex.current]);

	  // mutable ref objects don't cause re-renders, so this component might not work... 

    return (
        <div ref={containerRef} style={{ height: "85vh", overflowY: "auto", width: "70vw", maxWidth: "800px", backgroundColor: "#FAF9F6", padding: "20px 50px", boxShadow: "10px 10px 10px 1px rgba(0, 0, 0, .2)" }}>
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
					resetButton={resetButton}
					startFromDiffLine={startFromDiffLine}
					// handleCurrentLine={handleCurrentLine}
                    />
            })}
        </div>
    )
}