import AppError from '@/utils/AppError.js';
import axios from 'axios';

interface PincodeDetails {
  Name: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
}

const getPincodeDetails = async (pincode: string) => {
  try {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`,
    );
    if (response.data[0].Status === 'Error') {
      throw new AppError('Invalid Pincode', 400);
    }
    return response.data[0].PostOffice as PincodeDetails[];
  } catch (error) {
    throw new AppError('Invalid Pincode', 400);
  }
};

export default {
  getPincodeDetails,
};
