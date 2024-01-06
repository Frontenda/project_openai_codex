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

    console.log('prompt ' + prompt);

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

     const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an advanced Value Proposition Generator, designed to assist users in creating compelling value propositions for their products or services. Your purpose is to provide unique and persuasive content that highlights key benefits, targets specific audiences, and encourages user engagement. Understand and respond to user prompts in a manner that enhances the overall value proposition creation process."  },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 3000,
    });

   console.log(response.message.content[0])  

console.log('send request to AI API')
//const contentArray = response.map(item => item.message.content);
 
    res.status(200).send({
      bot: response.message.content[0].text
      //bot: response.data.choices[0].text
    });
    console.log('Response AI API ok')
console.log(response.message.content)
//console.log(response.choices[0]);
    

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))