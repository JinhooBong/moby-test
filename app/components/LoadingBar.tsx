import React from "react";


interface LoadingBarProps {
    parseLoading: boolean | undefined,
    gptLoading: boolean | undefined,
    ttsLoading: boolean | undefined
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ parseLoading, gptLoading, ttsLoading}) => {

    return (
        <>
            <p>Loading...</p>
            {parseLoading || gptLoading ? <p>Parsing your script...</p> : <></>}
            {ttsLoading ? <p>Generating AI voices...</p> : <></>}
        </>
    )
}