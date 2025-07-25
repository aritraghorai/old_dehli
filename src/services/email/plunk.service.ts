import env from '@/utils/env.js';
import axios from 'axios';

const sendEmail = async (email: string, subject: string, body: string) => {
  await axios.post(
    'https://api.useplunk.com/v1/send',
    {
      name: 'Old Delhi Foods App',
      subject: subject,
      body: body,
      to: email,
    },
    {
      headers: {
        ContentType: 'application/json',
        Authorization: `Bearer ${env.PLUNK_EMAIL_API_KEY}`,
      },
    },
  );
};

export default {
  sendEmail,
};
