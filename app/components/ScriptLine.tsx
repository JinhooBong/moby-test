import React from "react";

export interface ScriptLineObject {
    index?: number, 
    direction?: string,
    directions?: string,
    pauseSeconds?: number, 
    character?: string,
    line?: string,
    audioBuffer?: AudioBuffer | undefined,
    currLineIndex?: number,
    startClicked?: boolean,
    addScenePauses: Function
}

export const ScriptLine: React.FC<ScriptLineObject> = (
    { index, direction, character, line, audioBuffer, currLineIndex, startClicked, pauseSeconds, addScenePauses }) => {

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

        if (direction) {
            return (
                <div style={{ width: "1200px ", display: "flex", justifyContent: "space-evenly" }}>
                    <p style={{textAlign: "left"}}>{direction}</p>
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
            )
        } else {
            return (
                index === currLineIndex ? 
                <div style={{width: "600px", textAlign: "center", margin: "auto"}}>
                    <h3 style={{ textDecoration: "underline" }}>{character}</h3>
                    <p style={{ backgroundColor: startClicked ? "rgba(222, 244, 64, 0.7)" : "transparent" }}>{line}</p>
                </div>
                : <div style={{width: "600px", textAlign: "center", margin: "auto"}}>
                    <h3 style={{ textDecoration: "underline" }}>{character}</h3>
                    <p>{line}</p>
                </div>
            )
        }

}
