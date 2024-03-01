import React from "react";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingBarProps {
    parseLoading: boolean | undefined,
    gptLoading: boolean | undefined,
    ttsLoading: boolean | undefined,
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ 
    parseLoading, 
    gptLoading, 
    ttsLoading, 
}) => {

    return (
        <>
            <Box sx={{ width: '60vw', marginBottom: '20px' }}>
				<CircularProgress />
            </Box>
            {parseLoading || gptLoading ? <p>Parsing your script...</p> : <></>}
            {ttsLoading ? <p>Generating AI voices...</p> : <></>}
        </>
    )
}