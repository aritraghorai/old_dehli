import env from '@/utils/env.js';
import client from 'twilio';

const tc = client(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

const sendMessage = async (message: string, phoneNo: string) => {
  try {
    // const response = await axios.post(
    //   'https://graph.facebook.com/v18.0/202725406268279/messages ',
    //   {
    //     messaging_product: 'whatsapp',
    //     recipient_type: 'individual',
    //     to: '918101938115',
    //     type: 'text',
    //     text: {
    //       // the text object
    //       preview_url: false,
    //       body: message,
    //     },
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${env.WHATSAPP_API_KEY}`,
    //     },
    //   },
    // );
    const res = await tc.messages.create({
      body: "	Your Order abc is deliver.",
      from: 'whatsapp:+919958682539',
      to: `whatsapp:+918101938115`,
    });
    console.log(res);
  } catch (error) {
    console.error('Error:', error);
  }
};

export default { sendMessage };
