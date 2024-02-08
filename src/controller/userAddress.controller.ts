import { Address, UserAddress } from '@/entities/address.entity.js';
import { User } from '@/entities/user.entiry.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import { addressType } from '@/validator/address.validator.js';
import { Request, Response } from 'express';

const addNewAddress = catchAsync(
  async (req: Request<any, any, addressType>, res: Response) => {
    myDataSource.transaction(async manager => {
      const user = req.user as User;
      const address = req.body;
      let newAddress = manager.getRepository(Address).create(address);
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

export default { addNewAddress, getUserAddress };
