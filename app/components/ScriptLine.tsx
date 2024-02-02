
export interface ScriptLineObject {
    direction?: string,
    directions?: string,
    character?: string,
    line?: string,
    audioBuffer?: Buffer | undefined
}

export const ScriptLine: React.FC<ScriptLineObject> = (
    { direction, character, line, audioBuffer }) => {

        const playAudioBuffer = (audioBuffer: Buffer) => {
            console.log('what is this', audioBuffer);
            console.log('type', typeof audioBuffer);

            let audioContext = new AudioContext();

            try {
                if (audioBuffer.byteLength > 0) {
                    console.log('here');
                    audioContext.decodeAudioData(audioBuffer.buffer, (buffer) => {
                        const source = audioContext.createBufferSource();
                        source.buffer = buffer;
                        source.connect(audioContext.destination);
                        source.start();
                    })
                } else {
                    console.error("did not find any arguments");
                }
            } catch (e: any) {
                console.error(e);
            }

        }

        if (direction) {
            return <p style={{textAlign: "left"}}>{direction}</p>
        } else {
            return (
                <div style={{width: "600px", textAlign: "center", margin: "auto"}}>
                    <h3 style={{ textDecoration: "underline" }}>{character}</h3>
                    <p>{line}</p>
                    {audioBuffer ? <button style={{ border: '1px solid white' }} onClick={() => playAudioBuffer(audioBuffer)}>Play Audio</button> : <></>}
                </div>
            )
        }

}