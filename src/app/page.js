'use client';
import { useEffect, useState } from 'react';

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

import RecordButton from "@/components/RecordButton";

import { chatCompletion } from "@/services/gpt"

const DEFUALT_PROMPT = {
  fr: `Retranscript le message de l'utilisateur pour qu'il ai une belle mise en forme. Fait des sauts de ligne, forme des paragraphes avec les sujets.
Ne change pas les mots, ne change pas les phrases.
Ne dit rien d'autre.`,
  en: `Format the user message to have a nice formatting. Make line breaks, form paragraphs with the topics.
Do not change the words, do not change the sentences.
Do not say anything else.`
}


export default function Page() {
  const [isFrench, setIsFrench] = useState(true)
  const [transciprt, setTranscript] = useState("");
  const [prompt, setPrompt] = useState();
  const [formatted, setFormatted] = useState(''); // MD formatted text

  useEffect(() => {
    setPrompt(DEFUALT_PROMPT[isFrench ? 'fr' : 'en'])
  }, [isFrench])

  const getFormatted = async (t, p) => {
    const response = await chatCompletion({ system: p, user: t })
    setFormatted(response)
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">

      <div className="flex flex-row justify-end mb-2 w-full max-w-md text-sm">
        <div className="flex items-center space-x-2">
          <span className="mr-1">Prompt language:</span>
          <Label htmlFor="lang" className={!isFrench && 'font-bold'}>EN</Label>
          <Switch id="lang" onCheckedChange={setIsFrench} checked={isFrench} className="data-[state=checked]:bg-gray-200 dark:data-[state=checked]:bg-gray-800" />
          <Label htmlFor="lang" className={isFrench && 'font-bold'}>FR</Label>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <RecordButton onTranscriptionsCompleted={setTranscript} lang={isFrench ? 'fr-ca' : 'en-ca'}/>
        </div>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="transcript">Audio recorded transcript</Label>
            <Textarea
              id="transcript"
              placeholder="After you recorded, the transcript will appear here."
              rows={4}
              value={transciprt}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="prompt">Formattage prompt</Label>
            <Textarea
              id="prompt"
              placeholder=""
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <Button className="w-full" onClick={() => { getFormatted(transciprt, prompt) }}>Get result</Button>
          </div>
          <div>
            <Textarea
              id="formatted"
              value={formatted}
              rows={4}
              placeholder="The generated result will appear here."
            />
          </div>
        </div>
      </div>
    </main>
  );
}
