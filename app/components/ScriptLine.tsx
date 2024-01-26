
export interface ScriptLineObject {
    direction?: string,
    directions?: string,
    character?: string,
    line?: string,
    audioBuffer?: Buffer | undefined
}

export const ScriptLine: React.FC<ScriptLineObject> = ({ direction, character, line, audioBuffer }) => {


    const playAudioBuffer = async (audioBuffer: Buffer) => {
        console.log('entered audio fn');

        let audioContext = new AudioContext();
        let outputSource;

        try {
            if (await audioBuffer.byteLength > 0) {
                audioContext.decodeAudioData(audioBuffer.buffer,
                (buffer) => {
                    audioContext.resume();
                    outputSource = audioContext.createBufferSource();
                    outputSource.connect(audioContext.destination);
                    outputSource.buffer = buffer;
                    outputSource.start(0);

                    outputSource.addEventListener("ended", () => {
                        console.log('moby turn over');
                        // is this the right place to unhighlight
                        // mobyTurnLineFormat(currMobyLine, false);
                    });

                }, (err) => {
                    console.log('Error parsing through arrayBuffer', err.message);
                });
            } else {
                // mobyTurnLineFormat(currMobyLine, false);
                // mobyTurnLineFormat(false);
                console.error("did not find any arguments");
            }
        } catch(e) {
            console.log(e);
        }

        return;
    }

    if (direction) {
        return <p style={{textAlign: "left"}}>{direction}</p>
    } else {
        return (
            <div style={{width: "600px", textAlign: "center", margin: "auto"}}>
                <h3 style={{ textDecoration: "underline" }}>{character}</h3>
                <p>{line}</p>
                <button onClick={() => audioBuffer ? playAudioBuffer(audioBuffer) : console.log('file not found')}>Play Audio file</button>
            </div>
        )
    }

}