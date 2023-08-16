import axios from 'axios';

export async function askChatGPT(question) {
    console.log('req', question);
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
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
                    'Authorization': `Bearer ${process.env.API_KEY}`,
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
