"use client"

import React from 'react';
// import { UploadForm, ScriptObject } from './components/UploadForm';
import { UploadForm } from './components/UploadForm';
import { Script } from './components/Script';
import { ScriptLineObject } from './components/ScriptLine';

export interface ScriptObject {
    lines: ScriptLineObject[]
}

export default function Home() {
    
    const [isLoading, setIsLoading] = React.useState(false);
    const [script, setScript] = React.useState<ScriptObject>();
    const [showScript, setShowScript] = React.useState<boolean | undefined>(false);

    const handleLoading = (loadingState: boolean) => {
        setIsLoading(loadingState);
    }

    const handleDisplayScript = (shouldShowScript: boolean) => {
        setShowScript(shouldShowScript);
    }

    return (
        <>  
            {console.log('script', script)}
            {isLoading && !script ? <p>Loading...</p> : 
                <div style={{ display: script ? "none" : "block" }}>
                    <UploadForm setLoading={handleLoading} setTheScript={setScript} showScript={handleDisplayScript}/>
                </div>
            }
            {showScript && script ? <Script scriptToDisplay={script.lines} /> : <></>}
        </>
    )

}