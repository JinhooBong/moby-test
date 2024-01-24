'use client'

import { useState } from 'react';
import { ScriptView } from './ScriptView';
import { ScriptLineObject } from './ScriptLine';

export interface ScriptObject {
    lines: ScriptLineObject[]
}

export function UploadForm() {
    const [file, setFile] = useState<File>();
    const [textContent, setTextContent] = useState<ScriptObject>();

    const onClick = async () => {
        try {
            const res = await fetch('/api/TTS', {
                method: 'POST'
            });

            console.log('TTS response', await res.json());

        }  catch (e: any) {
            // Handle errors here
            console.error(e);
        }
    }

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

            // dataToParse is a string object 
            // we can maybe split by line
            // but we'll need a way to identify between dialogue and scene directions
            console.log('type', dataToParse.split("\n"));

            const parseRes = await fetch('/api/parser', {
                method: 'POST',
                body: dataToParse
            });

            const parsedResponse = await parseRes.json();
            const parsedData = JSON.parse(parsedResponse.content);
            console.log('parsed', parsedData);
            // this should be in format {"lines": [{direction} || {character}]}
            parsedData ? setTextContent(parsedData) : setTextContent({ lines: [] })

            // handle the error
            // if (!res.ok) throw new Error(await res.text());
                
        } catch (e: any) {
            // Handle errors here
            console.error(e);
        }
    }

    return (
        <div>
            {textContent !== undefined ? <ScriptView lines={textContent.lines} /> : <form onSubmit={onSubmit}>
            <input
                type="file"
                name="file"
                onChange={(e) => setFile(e.target.files?.[0])}
            />
            <input type="submit" value="Upload" />
            </form>}
            <button onClick={onClick}>test TTS</button>
        </div>
    )
}