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
	resetButton: React.MutableRefObject<boolean>
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
	resetButton
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
			currLineIndex.current = lineIndex;

			console.log('RESETBUTTON CURRENT', resetButton.current);
		}

        if (direction) {
            return (
                <div style={{ minWidth: "650px", margin: "20px auto", display: "flex", justifyContent: "space-evenly" }}>
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
