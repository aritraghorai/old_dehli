import env from '@/utils/env.js';
import axios from 'axios';

const sendMessage = async (message: string, phoneNo: string) => {
  try {
    const response = await axios.post(
      'https://graph.facebook.com/v18.0/202725406268279/messages ',
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: '918101938115',
        type: 'text',
        text: {
          // the text object
          preview_url: false,
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${env.WHATSAPP_API_KEY}`,
        },
      },
    );
    console.log('response', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default { sendMessage };
