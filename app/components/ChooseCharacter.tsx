import React from 'react';
import Button from '@mui/material/Button';

interface ChooseCharacterProps {
    characters: string[],
    setCharacter: Function,
	hasStarted: boolean,
	userCharacter?: string
}

export const ChooseCharacter: React.FC<ChooseCharacterProps> = ({ 
	characters, 
	setCharacter, 
	hasStarted, 
	userCharacter 
}) => {

    const [selectedCharacter, setSelectedCharacter] = React.useState(characters && characters.length > 0 ? characters[0] : '');

	const [showSelector, setShowSelector] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (characters && characters.length > 0) {
			setSelectedCharacter(characters[0]);
		}
	}, [characters]);

    const handleInitialChange = (e: any) => {
        // console.log('e', e.target.value);
        // console.log('selected', selectedCharacter);
        setSelectedCharacter(e.target.value as string);
    };

	const handleShowChange = () => {
		setShowSelector(!showSelector);
	};

	const handlePostChange = (e: any) => {
		setSelectedCharacter(e.target.value as string);
		setCharacter(e.target.value);
		setShowSelector(!showSelector);
	}

    const selectCharacter = (e: any) => {
        e.preventDefault();

        setCharacter(selectedCharacter);
    }

    return (
		<>
			{userCharacter ? 
				<div style={{ position: "fixed", zIndex: "1", top: "0", left: "0", padding: "20px", border: "1px solid white", background: "rgba(137, 169, 154, 0.7)" }}>
					<p>{"You are currently reading as : "}</p>
					<p className="scriptFont">{userCharacter}</p>
					<Button style={{ color: "#007562" }} variant="text" onClick={() => handleShowChange()}>Click to change</Button>
					<select value={userCharacter} onChange={(e) => handlePostChange(e)} style={{ color: "black", margin: "20px", padding: "0 20px", textAlign: "center", display: showSelector ? "block" : "none" }}>
						{characters.map((character, id) => {
							return <option key={id} value={character}>{character}</option>
						})}
					</select>
				</div> 	
			: <>
				<form onSubmit={(e) => selectCharacter(e)} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
					<label>
						<p style={{ fontSize: "20px" }}>{"Please select who you're reading for: "}</p>
						<select value={selectedCharacter} onChange={(e) => handleInitialChange(e)} style={{ color: "black", margin: "20px", padding: "10px 50px", fontSize: "20px", textAlign: "center", border: "none" }}>
							{characters.map((character, id) => {
								return <option key={id} value={character}>{character}</option>
							})}
						</select>
					</label>
					<br />
					<input type="submit" value="Submit" style={{ border: "none", padding: "10px 30px", borderRadius: "5px", width: "150px" }}/>
				</form>
        	</>}
		</>
    ) 
}