import React from 'react';

interface ChooseCharacterProps {
    characters: string[],
    setCharacter: Function,
	hasStarted: boolean,
	userCharacter?: string
}

/* 
    A component that will render before the script so that the user can identify
    which character they will be reading for. 

    Input: an array of strings 

    Output: updating the state in the parent value with the chosen character
*/
export const ChooseCharacter: React.FC<ChooseCharacterProps> = ({ 
	characters, 
	setCharacter, 
	hasStarted, 
	userCharacter 
}) => {

    const [selectedCharacter, setSelectedCharacter] = React.useState(characters && characters.length > 0 ? characters[0] : '');

	React.useEffect(() => {
		if (characters && characters.length > 0) {
			setSelectedCharacter(characters[0]);
		}
	}, [characters]);

    const handleChange = (e: any) => {
        console.log('e', e.target.value);
        console.log('selected', selectedCharacter);
        setSelectedCharacter(e.target.value as string);
    };

    const selectCharacter = (e: any) => {
        e.preventDefault();

        setCharacter(selectedCharacter);
    }

    return (
        <>
            <form onSubmit={(e) => selectCharacter(e)}>
                <label>
					<p>{hasStarted ? "Re-select / change character name: " : "Please select who you're reading for: " }</p>
                    <br />
                    <select value={selectedCharacter} onChange={(e) => handleChange(e)} style={{ color: "black", margin: "20px", padding: "0 20px", textAlign: "center" }}>
                        {characters.map((character, id) => {
                            return <option key={id} value={character}>{character}</option>
                        })}
                    </select>
                </label>
                <br />
                <input type="submit" value="Submit" style={{ border: "1px solid white", padding: "0 10px", borderRadius: "5px" }}/>
            </form>

        </>
    ) 
}