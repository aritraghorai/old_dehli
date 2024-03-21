import { Address, Pincode } from '@/entities/address.entity.js';
import { User, UserAddress } from '@/entities/user.entiry.js';
import AppError from '@/utils/AppError.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import { addressType } from '@/validator/address.validator.js';
import { Request, Response } from 'express';

const addNewAddress = catchAsync(
  async (req: Request<any, any, addressType>, res: Response) => {
    await myDataSource.transaction(async manager => {
      const pinCodeRepo = manager.getRepository(Pincode);
      const user = req.user as User;
      const address = req.body;
      const pincode = await pinCodeRepo.findOne({
        where: {
          id: address.pincode,
        },
      });
      if (!pincode) {
        throw new AppError('Invalid pincode', 400);
      }
      let newAddress = manager.getRepository(Address).create({
        ...address,
        pincode,
      });
      newAddress = await manager.save(newAddress);
      const userAddress = manager.getRepository(UserAddress).create({
        user: {
          id: user.id,
        },
        address: newAddress,
      });
      await manager.save(userAddress);
      res.status(200).json({
        status: true,
        message: 'Address added successfully',
        data: newAddress,
      });
    });
  },
);
const getUserAddress = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as User;
  const userAddress = await myDataSource.getRepository(UserAddress).find({
    where: {
      user: {
        id: user.id,
      },
    },
    relations: {
      address: true,
    },
  });
  res.status(200).json({
    status: true,
    data: userAddress,
  });
});

const setDefaultAddress = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const user = req.user as User;
    const userAddressId = req.params.id;
    await myDataSource.transaction(async manager => {
      const address = await manager.getRepository(UserAddress).findOne({
        where: {
          id: userAddressId,
        },
      });
      if (!address) {
        throw new AppError('Address not found', 404);
      }
      await manager.getRepository(UserAddress).update(
        {
          user: {
            id: user.id,
          },
        },
        {
          isDefault: false,
        },
      );
      await manager.getRepository(UserAddress).update(
        {
          user: {
            id: user.id,
          },
          address: {
            id: userAddressId,
          },
        },
        {
          isDefault: true,
        },
      );
      res.status(200).json({
        status: true,
        message: 'Default address set successfully',
      });
    });
  },
);

export default { addNewAddress, getUserAddress, setDefaultAddress };
