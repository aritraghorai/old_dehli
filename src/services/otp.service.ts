import { PlaidVerifyIdentityEmail } from '../../emails/otp/otp.tsx'
import plunkService from './email/plunk.service.ts'
import { render } from '@react-email/render';

const generateOtp = () => {
  //generate 6 digit number
  return "123456"
}

const sendOtp = async (otp: string, email: string) => {
  await plunkService.sendEmail(email, "Your OTP", 
    render(PlaidVerifyIdentityEmail({ validationCode: otp })));
}


export default {
  generateOtp,
  sendOtp
}
