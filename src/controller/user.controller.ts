import { User, UserProfile } from '@/entities/user.entiry.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import { UpdateProductRequestBody } from '@/validator/product.validator.js';
import { NewProfile, UpdateProfile } from '@/validator/profile.validator.js';
import { Request, Response } from 'express';
import { Not } from 'typeorm';

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const loggedInUser = req.user as User;
  const user = await User.find({ where: { id: Not(loggedInUser.id) } });
  res.status(200).json({ status: 'success', data: user });
});

const createProfile = catchAsync(
  async (req: Request<any, any, NewProfile>, res: Response) => {
    const loggedInUser = req.user as User;
    const { bio, image, fullName } = req.body;
    const newProfile = UserProfile.create({
      fullName,
      bio,
      image: { id: image },
    });
    await newProfile.save();
    loggedInUser.profile = newProfile;
    await loggedInUser.save();
    res.status(201).json({ status: 'success', data: newProfile });
  },
);

const updateUserProfile = catchAsync(
  async (req: Request<any, any, UpdateProfile>, res: Response) => {
    const loggedInUser = req.user as User;
    const { bio, image, fullName } = req.body;
    console.log(loggedInUser);
    const profile = loggedInUser.profile;
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }
    console.log(profile);
    if (bio) profile.bio = bio;
    if (fullName) profile.fullName = fullName;
    if (image) profile.image.id = image;
    await profile.save();
    res.status(200).json({ status: 'success', data: profile });
  },
);
export default {
  getAllUser,
  createProfile,
  updateUserProfile,
};
