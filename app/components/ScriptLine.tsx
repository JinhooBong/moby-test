import React from "react";

export interface ScriptLineObject {
    index: number, 
    direction?: string,
    directions?: string,
    pauseSeconds?: number, 
    character?: string,
    line?: string,
    audioBuffer?: AudioBuffer | undefined,
    // currLineIndex: number,
	currLineIndex: React.MutableRefObject<number>,
    startClicked?: boolean,
    addScenePauses: Function,
	resetButton: React.MutableRefObject<boolean>,
	startFromDiffLine: React.MutableRefObject<boolean>
	// handleCurrentLine: Function
}

export const ScriptLine: React.FC<ScriptLineObject> = ({ 
	index, 
	direction, 
	character, 
	line, 
	audioBuffer, 
	currLineIndex, 
	startClicked, 
	pauseSeconds, 
	addScenePauses,
	resetButton,
	startFromDiffLine
	// handleCurrentLine 
}) => {

        const [showPause, setShowPause] = React.useState(false);

        const handleYesClick = () => {
            setShowPause(true);
        }

        const handleNoClick = () => {
            setShowPause(false);
        }

        const handlePause = (index: number | undefined, seconds: string) => {
            const numOfSeconds = parseInt(seconds);
            if (index) {
                addScenePauses(index, numOfSeconds);
            }
        }  

		const handleLineStart = (lineIndex: number) => {
			console.log('index clicked', lineIndex);
			// this handleCurrentLine will update in Page.tsx
			// indexOfCurrLine to the clicked index
			// in this component, it will only be used to determine which line to highlight.
			// handleCurrentLine(lineIndex);

			// if reset is true, we want to set to false 

			// if (resetButton.current) {
			// 	currLineIndex.current = lineIndex;
			// } 

			// if clicked, we want to set resetButton to false and update the lineindex
			// resetButton.current = false;
			// currLineIndex.current = lineIndex;

			// we want to make startfromdiffline true 
			startFromDiffLine.current = true;
			currLineIndex.current = lineIndex;

			// we ONLY want this to get updated / changed IF the line gets clicked 
			// right now, it's pulling from the updated index and simply applying it
			// but we need another guardrail to determine IF this button has been clicked.. 

			// reset will not be true on the first rendering (when the script loads for the first time)
			// however, after that, anytime the script is played it will be true in between the time 
			// so i think this logic makes sense 
			// BUT now the edge case comes into play in the sense that if a user has already uploaded, 
			// and is using it for the sceond time but wants to start from a different line, 
			// this logic will prevent it 

			// currLineIndex.current = lineIndex;

			// console.log('RESETBUTTON CURRENT', resetButton.current);
		}

        if (direction) {
            return (
                <div style={{ minWidth: "650px", margin: "20px auto", display: "flex", justifyContent: "space-evenly", padding: "0 50px" }}>
                    <p className="scriptFont" style={{ width: "75%", textAlign: "left" }}>{direction}</p>
					<div style={{ width: "25%" }}>
						<p>Add a pause?: 
							<button style={{ border: "1px solid white", margin: "0px 10px" }} onClick={() => handleYesClick()}>Yes</button> 
							<button style={{ border: "1px solid white" }} onClick={() => handleNoClick()}>No</button> 
							{showPause ? <input 
								type="number" 
								style={{ width: "40px", color: "black", textAlign: "center", margin: "0px 10px" }} 
								min="0" max="20" 
								value={pauseSeconds} 
								onChange={(e) => handlePause(index, e.target.value)}
								/> 
							: <></>}
						</p>
					</div>
                </div>
            )
        } else {
            return (
                index === currLineIndex.current ? 
                <div style={{width: "300px", textAlign: "left", margin: "auto"}} onClick={() => handleLineStart(index)}>
                    <h3 className="scriptFont" style={{ marginBottom: "2px", textAlign: "center" }}>{character?.toLocaleUpperCase()}</h3>
                    {/* <p className="scriptFont" style={{ backgroundColor: startClicked ? "rgba(222, 244, 64, 0.7)" : "transparent", marginBottom: "5px" }}>{line}</p> */}
					<p className="scriptFont" style={{ backgroundColor: "rgba(248,255,0, 0.9)", marginBottom: "5px", padding: "10px" }}>{line}</p>
                </div>
                : <div style={{width: "300px", textAlign: "left", margin: "auto"}} onClick={() => handleLineStart(index)}>
                    <h3 className="scriptFont" style={{ marginBottom: "2px", textAlign: "center" }}>{character?.toLocaleUpperCase()}</h3>
                    <p className="scriptFont" style={{ marginBottom: "5px", padding: "10px" }}>{line}</p>
                </div>
            )
        }

}
