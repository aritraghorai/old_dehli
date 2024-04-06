const generateOtp = () => {
  //generate 6 digit number
  return "123456"
}

const sendOtp = async (otp: string, email: string) => {
  return Promise.resolve(true)
}


export default {
  generateOtp,
  sendOtp
}
