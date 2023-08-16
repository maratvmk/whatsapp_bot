
import dotenv from 'dotenv'
dotenv.config();

import twilio from 'twilio';
import express from 'express';
import bodyParser from 'body-parser';
import { askChatGPT } from './gpt.js';

const app = express();
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.post('/webhook', async (req, res) => {
    const userMessage = req.body.Body;

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Ваш запрос обрабатывается...');
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
    
    const gpt3Response = await askChatGPT(userMessage);
    console.log('res', gpt3Response);

    const maxLength = 1600;
    const maxWhatsappLength = 1355;
    
    if (gpt3Response.length > maxLength) {
        client.messages
            .create({
                body: gpt3Response.substring(0, maxWhatsappLength - 3) + '...',
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+77057814075'
            });

        client.messages
            .create({
                body: gpt3Response.substring(maxWhatsappLength-3, maxWhatsappLength - 3 + maxLength),
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+77057814075'
            });
    }
    else {
        client.messages
            .create({
                body: gpt3Response,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+77057814075'
            });
    }
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
