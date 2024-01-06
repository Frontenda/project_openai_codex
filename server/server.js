import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
   const prompt = req.body.prompt;

const response = await openai.createCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "You are a helpful marketing assistant." },
    { role: "user", content: `${prompt}` }
  ],
  temperature: 0, // Higher values mean the model will take more risks.
  max_tokens: 3000, // The maximum number of tokens to generate in the completion.
  top_p: 1, // Alternative to sampling with temperature, called nucleus sampling.
  frequency_penalty: 0.5, // Penalize new tokens based on their existing frequency in the text.
  presence_penalty: 0, // Penalize new tokens based on whether they appear in the text so far.
});
console.log('send request to AI API')
    res.status(200).send({
      bot: response.data.choices[0].text
    });
    console.log('Response AI API ok')

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))