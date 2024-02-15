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
    startClicked?: boolean
}

export const ScriptLine: React.FC<ScriptLineObject> = (
    { index, direction, character, line, audioBuffer, currLineIndex, startClicked, pauseSeconds }) => {

        const [showPause, setShowPause] = React.useState(false);
        const [numOfPauseSeconds, setNumOfPauseSeconds] = React.useState(0);

        const handleYesClick = () => {
            setShowPause(true);
        }

        const handleNoClick = () => {
            setShowPause(false);
        }



        // TODO: ------------------------------------------------------------------------------------------------------
        const handlePause = (seconds: string) => {
            const numOfSeconds = parseInt(seconds);
            setNumOfPauseSeconds(numOfSeconds);
            pauseSeconds = numOfPauseSeconds;
        }  

        // //  WHY ISNT THIS RE-RENDERING THE LINES TO INCLUDE THE SECONDS VALUE?
        // React.useEffect(() => {
        //     // console.log('NUMOFPAUSE', numOfPauseSeconds);
        //     pauseSeconds = numOfPauseSeconds;
        //     // console.log('PAUSE SECONDS', pauseSeconds);
        // }, [numOfPauseSeconds]);

        //x------------------------------------------------------------------------------------------------------

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
                            onChange={(e) => handlePause(e.target.value)}
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
