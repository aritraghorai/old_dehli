import { Pincode, PostOffices } from '@/entities/address.entity.js';
import pincodeService from '@/services/pincode.service.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import { PinCodeRequestBody } from '@/validator/pincode.validator.js';
import { Request, Response } from 'express';

const getPincode = catchAsync(
  async (req: Request<PinCodeRequestBody>, res: Response) => {
    const pinCode = req.params.pincode;

    await myDataSource.transaction(async manager => {
      const pincodeRepo = manager.getRepository(Pincode);
      const postOfficeRepo = manager.getRepository(PostOffices);
      const pincode = await pincodeRepo.findOne({
        where: {
          pincode: pinCode,
        },
        relations: {
          postOffices: true,
        },
      });
      if (!pincode) {
        const getPincodeDetail =
          await pincodeService.getPincodeDetails(pinCode);
        const newPincode = Pincode.create({
          pincode: pinCode,
        });
        await pincodeRepo.save(newPincode);
        for (const detail of getPincodeDetail) {
          const newPostOffice = postOfficeRepo.create({
            name: detail.Name,
            circle: detail.Circle,
            district: detail.District,
            division: detail.Division,
            region: detail.Region,
            block: detail.Block,
            state: detail.State,
            pincode: newPincode,
          });
          await postOfficeRepo.save(newPostOffice);
        }
        const pincode = await pincodeRepo.findOne({
          where: {
            pincode: pinCode,
          },
          relations: {
            postOffices: true,
          },
        });
        return res.status(200).json({
          status: 'success',
          message: 'Pincode details fetched successfully',
          data: pincode,
        });
      }
      return res.status(200).json({
        status: 'success',
        message: 'Pincode details fetched successfully',
        data: pincode,
      });
    });
  },
);

const getAllPincodes = catchAsync(async (req: Request, res: Response) => {
  const pincodes = await Pincode.find({
    relations: {
      postOffices: true,
    },
  });
  return res.status(200).json({
    status: 'success',
    data: pincodes,
  });
});

export default {
  getPincode,
  getAllPincodes,
};
