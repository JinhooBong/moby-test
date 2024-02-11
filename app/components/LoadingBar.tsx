import React from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

interface LoadingBarProps {
    parseLoading: boolean | undefined,
    gptLoading: boolean | undefined,
    ttsLoading: boolean | undefined,
    progress: number
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ 
    parseLoading, 
    gptLoading, 
    ttsLoading, 
    progress
}) => {

    return (
        <>
            <Box sx={{ width: '60vw', marginBottom: '20px' }}>
                <LinearProgress variant="determinate" value={progress} />
            </Box>
            {/* <p>Loading...</p> */}
            {parseLoading || gptLoading ? <p>Parsing your script...</p> : <></>}
            {ttsLoading ? <p>Generating AI voices...</p> : <></>}
        </>
    )
}