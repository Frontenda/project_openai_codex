import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 0)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const pre_prompt = 'You are an advanced Value Proposition Generator, designed to assist users in creating compelling value propositions for their products or services. Your purpose is to provide unique and persuasive content that highlights key benefits, targets specific audiences, and encourages user engagement. Understand and respond to user prompts in a manner that enhances the overall value proposition creation process. Generate a Value Proposition and Landing page Copy text, headline, 3 main features, for Product from description. '
    

    const post_prompt = 'Define niches are where product the best for option . Benefits Emphasize List 3-5 most valuable key benefits that support Headline  of Product for target audience. 3 Create a sub-headline for the value proposition that emphasizes from 2 response Benefits 2 and appeals to target audience 4 Write a paragraph that describes the value proposition and benefits of product for target audience . 5. Generate 1 user review that highlight the great values of product for  target audience. 6. Create a call to action phrase and button text that encourages target audience to desired action with product  7. Highlight the versatility and capabilities of product for different use cases. 8. Provide examples of different user groups or industries that can benefit from product. 9. Emphasize the flexibility of product  in meeting the needs of various users. 10. Discuss the potential value of product for target audience in terms of key benefits 11.'
    const addition_prompt = ' Provide examples use cases of how PRODUCT has helped users create RESULT for their NICHE , in WHERE business or personal use? Product Description: '
   
    console.log(data.get('prompt'))

    const response = await fetch('https://chatgptapi-fdew.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: pre_prompt  + post_prompt + addition_prompt + data.get('prompt') + 'Response in Markdown format about 3000 sybmols'
                //  prompt: pre_prompt  + post_prompt + addition_prompt + data.get('prompt') + 'Response in hmtl format, as h1 for titles, h2 for subheadline, ul>li for features, p for text. Style html with TailwindCSS style classes
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "
    
    if (response.ok) {
        const data = await response.json();
       // const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, data.bot)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})