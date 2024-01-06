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
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an advanced Value Proposition Generator, designed to assist users in creating compelling value propositions for their products or services. Your purpose is to provide unique and persuasive content that highlights key benefits, targets specific audiences, and encourages user engagement. Understand and respond to user prompts in a manner that enhances the overall value proposition creation process." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 3000,
    });

    // Check if the necessary properties exist before accessing them
    if (
      response &&
      response.message &&
      response.message.content &&
      response.message.content[0] &&
      response.message.content[0].text
    ) {
      console.log(response.message.content[0].text);

      console.log('send request to AI API');
      res.status(200).send({
        bot: response.message.content[0].text,
      });
      console.log('Response AI API ok');
      console.log(response.message.content);
    } else {
      console.error('Unexpected response structure from OpenAI API:', response);
      res.status(500).send('Unexpected response structure from OpenAI API');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Something went wrong');
  }
});


app.listen(5000, () => console.log('AI server started on http://localhost:5000'))