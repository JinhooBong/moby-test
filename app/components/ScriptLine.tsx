
export interface ScriptLineObject {
    direction?: String,
    directions?: String,
    character?: String,
    line?: String
}

export const ScriptLine: React.FC<ScriptLineObject> = ({ direction, character, line }) => {

    if (direction) {
        return <p style={{textAlign: "left"}}>{direction}</p>
    } else {
        return (
            <div style={{width: "600px", textAlign: "center", margin: "auto"}}>
                <h3>{character}</h3>
                <p>{line}</p>
            </div>
        )
    }

}