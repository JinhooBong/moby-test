
export interface ScriptLineObject {
    direction?: string,
    directions?: string,
    character?: string,
    line?: string
}

export const ScriptLine: React.FC<ScriptLineObject> = ({ direction, character, line }) => {

    if (direction) {
        return <p style={{textAlign: "left"}}>{direction}</p>
    } else {
        return (
            <div style={{width: "600px", textAlign: "center", margin: "auto"}}>
                <h3 style={{ textDecoration: "underline" }}>{character}</h3>
                <p>{line}</p>
            </div>
        )
    }

}