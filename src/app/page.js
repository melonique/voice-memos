'use client';
import { useState } from 'react';

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import RecordButton from "@/components/RecordButton";

import { chatCompletion } from "@/services/gpt"

export default function Page() {

  const [transciprt, setTranscript] = useState("Alors, le but c'est de faire un DataPond. Le DataPond est une ressource dans Azure qui est en fait un bucket de data. Où est-ce que les accès vont être gérés par la GIA qui vont s'occuper de faire les logs de tout ce qui se passe là-dessus?");
  const [prompt, setPrompt] = useState("Format le message de l'utilisateur pour qu'il ai une belle mise en forme en MarkDown. Fait des sauts de ligne, forme des paragraphes avec les sujets. Ne change pas les mots, ne change pas les phrases.Ne dit rien d'autre.")
  const [formatted, setFormatted] = useState(''); // MD formatted text

  const getFormatted = async (t, p) => {
    const response = await chatCompletion({ system: p, user: t })
    setFormatted(response)
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <RecordButton onTranscriptionsCompleted={setTranscript} />
        </div>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="transcript">Transcript</Label>
            <Textarea
              id="transcript"
              placeholder="Transcript will appear here"
              rows={4}
              value={transciprt}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Prompt will appear here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <Button className="w-full" onClick={() => { getFormatted(transciprt, prompt) }}>Get Result</Button>
          </div>
          <div>
            <Textarea
              id="formatted"
              value={formatted}
              rows={4}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
