
/* 

    A component that will render before the script so that the user can identify
    which character they will be reading for. 

    Input: ideally be just an array of the character names
    // we can work around this by sending in the whole script, and generating the list of characters here

    Output: updating the state in the parent value with the chosen character

*/
import React from "react";

interface ChooseCharacterProps {
    characters: string[],
    setCharacter: Function
}

export const ChooseCharacter: React.FC<ChooseCharacterProps> = ({ characters, setCharacter }) => {

    const [selectedCharacter, setSelectedCharacter] = React.useState('');

    const handleChange = (e: any) => {
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
                    Please select who you're reading for:
                    <br />
                    <select value={selectedCharacter} onChange={(e) => handleChange(e)} style={{ color: 'black' }}>
                        {characters.map((character, id) => {
                            return <option key={id} value={character}>{character}</option>
                        })}
                    </select>
                </label>
                <br />
                <input type="submit" value="Submit" />
            </form>

        </>
    ) 
}