import React from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';

export interface ScriptLineObject {
    index: number, 
    direction?: string,
    directions?: string,
    pauseSeconds?: number, 
    character?: string,
    line?: string,
    audioBuffer?: AudioBuffer | undefined,
	currLineIndex: React.MutableRefObject<number>,
    startClicked?: boolean,
    addScenePauses: Function,
	resetButton: React.MutableRefObject<boolean>,
	startFromDiffLine: React.MutableRefObject<boolean>
}

export const ScriptLine: React.FC<ScriptLineObject> = ({ 
	index, 
	direction, 
	character, 
	line, 
	audioBuffer, 
	currLineIndex, 
	startClicked, 
	pauseSeconds, 
	addScenePauses,
	resetButton,
	startFromDiffLine
}) => {

		const pauseSecondsRef = React.useRef<number>(0);

        const handlePause = (index: number | undefined, seconds: string) => {
            const numOfSeconds = parseInt(seconds);
            if (index) {
                addScenePauses(index, numOfSeconds);
				pauseSecondsRef.current = numOfSeconds;
            }
        }  

		const handleLineStart = (lineIndex: number) => {
			console.log('index clicked', lineIndex);

			startFromDiffLine.current = true;
			currLineIndex.current = lineIndex;
		}

		const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
		const open = Boolean(anchorEl);
		const handleClick = (event: React.MouseEvent<HTMLElement>) => {
			setAnchorEl(event.currentTarget);
		};
		const handleClose = () => {
			setAnchorEl(null);
		};

        if (direction) {
            return (
                <div style={{ minWidth: "650px", margin: "20px auto", display: "flex", justifyContent: "space-evenly", padding: "0 75px" }}>
                    <p className="scriptFont" style={{ width: "75%", textAlign: "left" }}>{direction}</p>
					<div style={{ width: "25%", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<div>
							<IconButton
								aria-label="more"
								id="long-button"
								aria-controls={open ? 'long-menu' : undefined}
								aria-expanded={open ? 'true' : undefined}
								aria-haspopup="true"
								onClick={handleClick}
							>
								<MoreHorizIcon />
							</IconButton>
							<Menu
								id="long-menu"
								MenuListProps={{
									'aria-labelledby': 'long-button',
									'className': 'pauseMenu'
								}}
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
							>
								<p style={{ fontSize: "14px" }}>Add a pause? </p>
								<input 
									type="number" 
									style={{ height: "20px", width: "50px", color: "black", textAlign: "center", margin: "0px 10px" }} 
									min="0" max="20" 
									value={pauseSecondsRef.current} 
									onChange={(e) => handlePause(index, e.target.value)}
								/> 
							</Menu>
						</div>
								
					</div>
                </div>
            )
        } else {
            return (
                index === currLineIndex.current ? 
                <div style={{width: "350px", textAlign: "left", margin: "auto"}} onClick={() => handleLineStart(index)}>
                    <h3 className="scriptFont" style={{ marginBottom: "2px", textAlign: "center" }}>{character?.toLocaleUpperCase()}</h3>
					<div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
						<p className="scriptFont" style={{ backgroundColor: "rgba(248,255,0, 0.9)", marginBottom: "5px", padding: "10px" }}>{line}</p>
						<div>
								<IconButton
									aria-label="more"
									id="long-button"
									aria-controls={open ? 'long-menu' : undefined}
									aria-expanded={open ? 'true' : undefined}
									aria-haspopup="true"
									onClick={handleClick}
								>
									<MoreHorizIcon />
								</IconButton>
								<Menu
									id="long-menu"
									MenuListProps={{
										'aria-labelledby': 'long-button',
										'className': 'pauseMenu'
									}}
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
								>
									<p style={{ fontSize: "14px" }}>Add a pause? </p>
									<input 
										type="number" 
										style={{ height: "20px", width: "50px", color: "black", textAlign: "center", margin: "0px 10px" }} 
										min="0" max="20" 
										value={pauseSecondsRef.current} 
										onChange={(e) => handlePause(index, e.target.value)}
									/> 
								</Menu>
							</div>
						</div>
                </div>
                : <div style={{width: "350px", textAlign: "left", margin: "auto"}} onClick={() => handleLineStart(index)}>
                    <h3 className="scriptFont" style={{ marginBottom: "2px", textAlign: "center" }}>{character?.toLocaleUpperCase()}</h3>
					<div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    	<p className="scriptFont" style={{ marginBottom: "5px", padding: "10px" }}>{line}</p>
						<div>
								<IconButton
									aria-label="more"
									id="long-button"
									aria-controls={open ? 'long-menu' : undefined}
									aria-expanded={open ? 'true' : undefined}
									aria-haspopup="true"
									onClick={handleClick}
								>
									<MoreHorizIcon />
								</IconButton>
								<Menu
									id="long-menu"
									MenuListProps={{
										'aria-labelledby': 'long-button',
										'className': 'pauseMenu'
									}}
									anchorEl={anchorEl}
									open={open}
									onClose={handleClose}
								>
									<p style={{ fontSize: "14px" }}>Add a pause? </p>
									<input 
										type="number" 
										style={{ height: "20px", width: "50px", color: "black", textAlign: "center", margin: "0px 10px" }} 
										min="0" max="20" 
										value={pauseSecondsRef.current} 
										onChange={(e) => handlePause(index, e.target.value)}
									/> 
								</Menu>
							</div>
						</div>
                </div>
            )
        }

}
