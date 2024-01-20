import { NextRequest, NextResponse } from 'next/server';

/* 
    Using ELEVENLABS API to try incorporating TTS
*/
export async function POST(request: NextRequest) {

    console.log('entered TTS call');

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: '{"model_id":"eleven_monolingual_v1","pronunciation_dictionary_locators":[{"pronunciation_dictionary_id":"1","version_id":"fGBb930nW3I71asYoAax"}],"text":"testing testing hello","voice_settings":{"similarity_boost":123,"stability":123,"style":123,"use_speaker_boost":true}}'
      };
      
      fetch('https://api.elevenlabs.io/v1/text-to-speech/{voice_id}', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}


/* 
{
  detail: {
    status: 'invalid_uid',
    message: "An invalid ID has been received: '{voice_id}'. Make sure to provide a correct one."
  }

*/