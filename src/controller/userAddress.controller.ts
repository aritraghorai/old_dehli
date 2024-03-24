import { Address, Pincode } from '@/entities/address.entity.js';
import { User, UserAddress } from '@/entities/user.entiry.js';
import AppError from '@/utils/AppError.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import {
  addressType,
  updateAddressType,
} from '@/validator/address.validator.js';
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

const updateAddress = catchAsync(
  async (
    req: Request<{ id: string }, any, updateAddressType>,
    res: Response,
  ) => {
    const user = req.user as User;
    const userAddressId = req.params.id;
    const {
      name,
      mobile,
      alternatePhone,
      pincode,
      locality,
      address: updateAddress,
      city,
      landmark,
      state,
    } = req.body;
    await myDataSource.transaction(async manager => {
      const address = await manager.getRepository(UserAddress).findOne({
        where: {
          id: userAddressId,
        },
      });
      if (!address) {
        throw new AppError('Address not found', 404);
      }
      if (name) address.address.name = name;
      if (mobile) address.address.mobile = mobile;
      if (alternatePhone) address.address.alternatePhone = alternatePhone;
      if (pincode) {
        const pincodeEntity = await manager.getRepository(Pincode).findOne({
          where: {
            id: pincode,
          },
        });
        if (!pincodeEntity) {
          throw new AppError('Invalid pincode', 400);
        }
        address.address.pincode = pincodeEntity;
      }
      if (locality) address.address.locality = locality;
      if (address) address.address.address = updateAddress;
      if (city) address.address.city = city;
      if (landmark) address.address.landmark = landmark;
      if (state) address.address.state = state;
      await manager.save(address);
      res.status(200).json({
        status: true,
        message: 'Address updated successfully',
        data: address,
      });
    });
  },
);

const deleteAddress = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const user = req.user as User;
    const userAddressId = req.params.id;
    await myDataSource.transaction(async manager => {
      const address = await manager.getRepository(UserAddress).findOne({
        where: {
          id: userAddressId,
          user: {
            id: user.id,
          },
        },
      });
      if (!address) {
        throw new AppError('Address not found', 404);
      }

      await manager.getRepository(UserAddress).delete({
        id: userAddressId,
      });
      await manager.getRepository(Address).delete({
        id: address.address.id,
      });
      res.status(200).json({
        status: true,
        message: 'Address deleted successfully',
      });
    });
  },
);

export default {
  addNewAddress,
  getUserAddress,
  setDefaultAddress,
  updateAddress,
  deleteAddress,
};
