import { Pincode, PostOffices } from '@/entities/address.entity.js';
import pincodeService from '@/services/pincode.service.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import { PinCodeRequestBody } from '@/validator/pincode.validator.js';
import { Request, Response } from 'express';
import { In } from 'typeorm';

const checkPinCodesExistOrAdd = async (pinCodes: string[]) => {
  return await myDataSource.transaction(async manager => {
    const pincodeRepo = manager.getRepository(Pincode);
    const postOfficeRepo = manager.getRepository(PostOffices);
    const result = [];

    const findPinCodes = await pincodeRepo.find({
      where: {
        pincode: In(pinCodes),
      },
      relations: {
        postOffices: true,
      },
    });

    const pinCodeMap = new Map<string, Pincode>();
    for (const pinCode of findPinCodes) {
      pinCodeMap.set(pinCode.pincode, pinCode);
    }

    const getNotExistPinCodes = pinCodes.filter(pinCode => {
      if (pinCodeMap.has(pinCode) === false) {
        return true;
      }
      return false;
    });

    const newNotExistPinCodes = [];

    let numberOfError = 0;

    for (const pinCode of getNotExistPinCodes) {
      try {
        const getPincodeDetail = await pincodeService.getPincodeDetails(
          pinCode,
        );
        const newPincode = pincodeRepo.create({
          pincode: pinCode,
        });
        const postOffices = getPincodeDetail.map(detail => {
          return postOfficeRepo.create({
            name: detail.Name,
            circle: detail.Circle,
            district: detail.District,
            division: detail.Division,
            region: detail.Region,
            block: detail.Block,
            state: detail.State,
            pincode: newPincode,
          });
        });
        newNotExistPinCodes.push(newPincode);
      } catch (e) {
        numberOfError++;
      }
    }
    pincodeRepo.save(newNotExistPinCodes);
    result.push(...findPinCodes, ...newNotExistPinCodes);
    return result;
  });
};

const checkPinCodeExistOrAdd = async (pinCode: string) => {
  return await myDataSource.transaction(async manager => {
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
      const getPincodeDetail = await pincodeService.getPincodeDetails(pinCode);
      const newPincode = Pincode.create({
        pincode: pinCode,
      });
      await pincodeRepo.save(newPincode);

      const postOffices = [];
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
        postOffices.push(newPostOffice);
      }
      await postOfficeRepo.save(postOffices);
      const pincode = await pincodeRepo.findOne({
        where: {
          pincode: pinCode,
        },
        relations: {
          postOffices: true,
        },
      });
      return pincode;
    }
    return pincode;
  });
};

const getPincode = catchAsync(
  async (req: Request<PinCodeRequestBody>, res: Response) => {
    const pinCode = req.params.pincode;

    const pin = await checkPinCodeExistOrAdd(pinCode);

    return res.status(200).json({
      status: 'success',
      data: pin,
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
  checkPinCodeExistOrAdd,
  checkPinCodesExistOrAdd,
};
