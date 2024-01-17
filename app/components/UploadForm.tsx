'use client'

import { useState } from 'react';
import { ScriptView } from './ScriptView';

export function UploadForm() {
    const [file, setFile] = useState<File>();
    const [textContent, setTextContent] = useState({});

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        try {
            const data = new FormData();
            data.set('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data
            })

            const textResponse = await res.json();
            const dataToParse = textResponse.message;
            console.log('console text', dataToParse);

            const parseRes = await fetch('/api/parser', {
                method: 'POST',
                body: dataToParse
            });

            const parsedResponse = await parseRes.json();
            const parsedData = parsedResponse.content;
            console.log('parsed', parsedData);
            // this should be in format {"lines": [{direction} || {character}]}
            setTextContent(parsedData);

            // handle the error
            if (!res.ok) throw new Error(await res.text());
                
        } catch (e: any) {
            // Handle errors here
            console.error(e);
        }
    }

    return (
        <div>
            {Object.keys(textContent).length > 0 ? <ScriptView script={textContent} /> : <form onSubmit={onSubmit}>
            <input
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files?.[0])}
            />
            <input type="submit" value="Upload" />
            </form>}
        </div>
    )
}