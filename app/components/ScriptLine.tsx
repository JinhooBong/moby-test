
export interface ScriptLineObject {
    index?: number, 
    direction?: string,
    directions?: string,
    character?: string,
    line?: string,
    audioBuffer?: Buffer | undefined,
    currLineIndex?: number,
    startClicked?: boolean
}

export const ScriptLine: React.FC<ScriptLineObject> = (
    { index, direction, character, line, audioBuffer, currLineIndex, startClicked }) => {

        if (direction) {
            return <p style={{textAlign: "left"}}>{direction}</p>
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