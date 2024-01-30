"use client"

import React from 'react';
// import { UploadForm, ScriptObject } from './components/UploadForm';
import { UploadForm } from './components/UploadForm';
import { Script } from './components/Script';
import { ScriptLineObject } from './components/ScriptLine';

export interface ScriptObject {
    lines: ScriptLineObject[]
}

// export default function Home() {

//     // const [script, setScript] = React.useState<ScriptObject>();
//     const [isLoading, setIsLoading] = React.useState(false);

//     // const updateScript = (script: ScriptObject) => {
//     //     setScript(script);
//     // }

//     // const updateLoading = (loadingState: boolean) => {
//     //     setIsLoading(loadingState);
//     // }

//     return (
//         <>
//             {/* {console.log('script', script)} */}
//             {/* {isLoading ? <p>Loading...</p> : <UploadForm setScript={updateScript} setLoading={updateLoading}/>} */}
//             {/* {script ? <Script lines={script.lines} /> : <></>} */}
//         </>
//     )
// }



export default function Home() {
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [script, setScript] = React.useState<ScriptObject>();

    const handleLoading = (loadingState: boolean) => {
        setIsLoading(loadingState);
    }

    return (
        <>  
            {console.log('script', script)}
            {isLoading && !script ? <p>Loading...</p> : 
                <div style={{ display: script ? "none" : "block" }}>
                    <UploadForm setLoading={handleLoading} setTheScript={setScript}/>
                </div>
            }
            {script ? <Script scriptToDisplay={script.lines} /> : <></>}
        </>
    )

}