// RecordButton.js
import React, { useState, useRef } from 'react';
import { speechToText } from '@/services/whisper'
import { MicIcon, StopIcon, LoadingSpinner } from "@/components/icons"
import Timer from './Timer';

const isAudioTooLong = (blob) => blob.size >= 25 * 1000000;

const RecordButton = ({ onTranscriptionsCompleted, lang='fr-ca' }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorder = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const startRecording = async () => {
    if (recording) return; // Already recording

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = handleDataAvailable;
      mediaRecorder.current.start();

      setRecording(true);
    } catch (error) {
      console.error("Error accessing the microphone:", error);
    }
  };

  const stopRecording = () => {
    if (!recording) return; // Not currently recording

    mediaRecorder.current.stop(); // Stop the recording

    setRecording(false);
  };

  const handleDataAvailable = async (event) => {
    setIsLoading(true)

    const blob = new Blob([event.data], { type: "audio/ogg" });

    const audioURL = URL.createObjectURL(blob);
    setAudioURL(audioURL);

    if (isAudioTooLong(blob)) {
      alert('Audio too long.  Consider a shorter description of the photo.');
      return;
    }



    const formdata = new FormData();
    formdata.append("file", blob, audioURL);
    formdata.append("lang", lang);

    fetch('./api/speech', { method: "POST", body: formdata })
      .then((response) => response.json())
      .then(({text}) => {
        onTranscriptionsCompleted(text)
      })
      .catch((error) => {
        console.error("Error:", error);
        alert('Unable to get speech to text: ' + error.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <div>
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`
          ${recording ||isLoading ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}
          text-white font-bold py-4 px-8 rounded-full shadow-lg transition-colors duration-300`}
          disabled={isLoading}
        >
          {recording && <StopIcon className="w-8 h-8" />}
          {isLoading && <LoadingSpinner className="w-8 h-8" />}
          {!recording && !isLoading &&  <MicIcon className="w-8 h-8" />}
        </button>
      </div>
      <div>
        {recording &&
          <Timer />
        }
        {!recording && audioURL && (
          <audio src={audioURL} controls="controls" />
        )}
      </div>
    </>
  );
};

export default RecordButton;
