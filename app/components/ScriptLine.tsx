
export interface ScriptLineObject {
    direction?: string,
    directions?: string,
    character?: string,
    line?: string,
    audioBuffer?: Buffer | undefined
}

export const ScriptLine: React.FC<ScriptLineObject> = (
    { direction, character, line, audioBuffer }) => {

        // console.log('audioBuffer? ', audioBuffer);

        // // play the audio buffer object
        // const playAudioBuffer = async (audioBuffer: Buffer) => {
        //     console.log('entered audio fn');

        //     console.log('audioBuffer', audioBuffer);
        //     console.log('audioBuffer', audioBuffer.buffer);

        //     /* 
        //         ERROR: down in the decodeAudioData function
        //         audioBuffer.buffer is not the right argument?
                
        //     */

        //     let audioContext = new AudioContext();
        //     let outputSource;

        //     try {
        //         if (await audioBuffer.byteLength > 0) {
        //             audioContext.decodeAudioData(audioBuffer.buffer,
        //                 (buffer) => {
        //                     // audioContext.resume();
        //                     // outputSource = audioContext.createBufferSource();
        //                     // outputSource.connect(audioContext.destination);
        //                     // outputSource.buffer = buffer;
        //                     // outputSource.start(0);

        //                     // outputSource.addEventListener("ended", () => {
        //                     //     console.log('moby turn over');
        //                     // });
        //                     console.log('buffer', buffer);
        //                 }, (err) => {
        //                 console.log('Error parsing through arrayBuffer', err.message);
        //             });
        //         } else {
        //             console.error("did not find any arguments");
        //         }
        //     } catch(e) {
        //         console.log(e);
        //     }

        //     return;
        // }

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
                    {/* <button style={{ border: '1px solid white' }} onClick={() => audioBuffer ? playAudioBuffer(audioBuffer) : console.log('file not found')}>Play Audio file</button> */}
                    {audioBuffer ? <button style={{ border: '1px solid white' }} onClick={() => playAudioBuffer(audioBuffer)}>Play Audio</button> : <></>}
                </div>
            )
        }

}