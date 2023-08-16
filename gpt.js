import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = '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';

export async function askChatGPT(question) {
    console.log('req', question);
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-3.5-turbo",
                messages: [
                  {
                    "role": "user",
                    "content": question
                  }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error asking ChatGPT:', error);
        return 'Произошла ошибка при обработке повторите ваш вопрос';
    }
}
