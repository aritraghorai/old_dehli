import { PlaidVerifyIdentityEmail } from '../../emails/otp/otp.js';
import plunkService from './email/plunk.service.js';
import { render } from '@react-email/render';

const generateOtp = () => {
  //generate 6 digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (otp: string, email: string) => {
  await plunkService.sendEmail(
    email,
    'Your OTP',
    render(PlaidVerifyIdentityEmail({ validationCode: otp })),
  );
};

export default {
  generateOtp,
  sendOtp,
};
