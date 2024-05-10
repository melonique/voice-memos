'use server'
import { OpenAIClient, AzureKeyCredential } from '@azure/openai'

const ENDPOINT = process.env.AZURE_GPT_URL
const KEY = process.env.AZURE_GPT_API_KEY


let deploymentName = 'gpt-35-turbo-1106'


const client = new OpenAIClient(ENDPOINT, new AzureKeyCredential(KEY));

export const chatCompletion = async ({ system, user }) => {

  try {
    const messages = [
      { role: "system", content: system },
      { role: "user", content: user },
    ];

    const result = await client.getChatCompletions(deploymentName, messages);

    return result.choices[0].message?.content;
  } catch (error) {
    console.log(error)
  }
}
