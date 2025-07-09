import { Pincode, Zone } from '@/entities/address.entity.js';
import { Product } from '@/entities/product.entity.js';
import { readEcexl } from '@/services/exel/excel.service.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import { NewZone } from '@/validator/zones.validator.js';
import { Request, Response } from 'express';
import pincodeController from './pincode.controller.js';
import _ from 'lodash';
import fs from 'fs/promises';
import { In } from 'typeorm';
import { allIndiaFilter } from './orderController.js';

//Indian pincode regex
let regex = new RegExp(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/);
const removeDuplicateAndNull = (codes: string[]) => {
  const map = new Map<string, true>();
  const newCode = [];
  for (let code of codes) {
    if (
      code !== undefined &&
      _.isNumber(code) &&
      regex.test(code) &&
      !map.has(code)
    ) {
      newCode.push(_.trim(code));
      map.set(_.trim(code), true);
    }
  }
  return newCode;
};

const checkNotExistPinCodeAndAddThose = async (pinCodeList: string[]) => {
  const pinCodes = await Pincode.find({
    where: {
      pincode: In(pinCodeList),
    },
  });
  const pinCodeMap = new Map<string, Pincode>();
  for (const pinCode of pinCodes) {
    pinCodeMap.set(pinCode.pincode, pinCode);
  }
  if (pinCodes.length === pinCodeList.length) {
    return pinCodes;
  }
  const notExistPinCodes = [];
  for (const pinCode of pinCodeList) {
    if (!pinCodeMap.has(pinCode)) {
      notExistPinCodes.push(pinCode);
    }
  }
  return pinCodes;
};

const createNewZone = catchAsync(
  async (req: Request<any, any, NewZone>, res: Response) => {
    const {
      name,
      pincodes = [],
      deliveryCharges,
      products = [],
      minOrderValue = 0,
    } = req.body;
    const newZone = Zone.create({
      name,
      deliveryCharges,
      minOrderValue,
    });
    await newZone.save();
    newZone.pincodes = [];
    newZone.products = [];
    for (const pincode of pincodes) {
      const pincodeEntity = await Pincode.findOne({
        where: {
          id: pincode,
        },
      });
      if (pincodeEntity) newZone.pincodes.push(pincodeEntity);
    }
    for (const shop of products) {
      const shopEntity = await Product.findOne({
        where: {
          id: shop,
        },
      });
      if (shopEntity) newZone.products.push(shopEntity);
    }
    await newZone.save();
    return res.status(201).json({
      status: 'success',
      message: 'Zone created successfully',
      data: newZone,
    });
  },
);

const updateZoneById = catchAsync(
  async (req: Request<{ id: string }, any, NewZone>, res: Response) => {
    const {
      name,
      pincodes = [],
      deliveryCharges,
      products = [],
      minOrderValue,
    } = req.body;

    // Single query to get the zone with relations
    const updatedZone = await Zone.findOne({
      where: {
        id: req.params.id,
      },
      relations: {
        pincodes: true,
        products: true,
      },
    });

    if (!updatedZone) {
      throw new AppError('Zone not found', 404);
    }

    // Update basic fields
    updatedZone.name = name;
    updatedZone.deliveryCharges = deliveryCharges;
    if (minOrderValue) {
      updatedZone.minOrderValue = minOrderValue;
    }

    // Batch query for all pincodes if any are provided
    let pincodeEntities = [];
    if (pincodes.length > 0) {
      pincodeEntities = await Pincode.findBy({
        id: In(pincodes),
      });

      // Check if all pincodes exist
      if (pincodeEntities.length !== pincodes.length) {
        const foundPincodeIds = pincodeEntities.map(p => p.id);
        const missingPincodes = pincodes.filter(
          id => !foundPincodeIds.includes(id),
        );
        return res.status(404).json({
          status: 'error',
          message: `Pincode(s) not found: ${missingPincodes.join(', ')}`,
        });
      }

      // Replace the zone's pincodes with the new ones
      updatedZone.pincodes = pincodeEntities;
    } else {
      // If no pincodes provided, clear the existing ones
      updatedZone.pincodes = [];
    }

    // Batch query for all products if any are provided
    let productEntities = [];
    if (products.length > 0) {
      productEntities = await Product.findBy({
        id: In(products),
      });

      // Check if all products exist
      if (productEntities.length !== products.length) {
        const foundProductIds = productEntities.map(p => p.id);
        const missingProducts = products.filter(
          id => !foundProductIds.includes(id),
        );
        throw new AppError(
          `Product(s) not found: ${missingProducts.join(', ')}`,
          404,
        );
      }

      // Replace the zone's products with the new ones
      updatedZone.products = productEntities;
    } else {
      // If no products provided, clear the existing ones
      updatedZone.products = [];
    }

    // Get repository and update
    const zoneRepository = Zone.getRepository();

    // Save basic fields
    await zoneRepository.save({
      id: updatedZone.id,
      name: updatedZone.name,
      deliveryCharges: updatedZone.deliveryCharges,
      minOrderValue: updatedZone.minOrderValue,
    });

    // Update pincodes relationship
    await zoneRepository
      .createQueryBuilder()
      .relation(Zone, 'pincodes')
      .of(updatedZone.id)
      .remove(updatedZone.pincodes.map(p => p.id));

    if (pincodeEntities.length > 0) {
      await zoneRepository
        .createQueryBuilder()
        .relation(Zone, 'pincodes')
        .of(updatedZone.id)
        .add(pincodeEntities.map(p => p.id));
    }

    // Update products relationship
    await zoneRepository
      .createQueryBuilder()
      .relation(Zone, 'products')
      .of(updatedZone.id)
      .remove(updatedZone.products.map(p => p.id));

    if (productEntities.length > 0) {
      await zoneRepository
        .createQueryBuilder()
        .relation(Zone, 'products')
        .of(updatedZone.id)
        .add(productEntities.map(p => p.id));
    }

    // Fetch updated entity with relations
    const finalZone = await Zone.findOne({
      where: { id: updatedZone.id },
      relations: {
        pincodes: true,
        products: true,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Zone updated successfully',
      data: finalZone,
    });
  },
);

// const updateZoneById = catchAsync(
//   async (req: Request<{ id: string }, any, NewZone>, res: Response) => {
//     const {
//       name,
//       pincodes = [],
//       deliveryCharges,
//       products = [],
//       minOrderValue,
//     } = req.body;
//     const updatedZone = await Zone.findOne({
//       where: {
//         id: req.params.id,
//       },
//       relations: {
//         pincodes: true,
//         products: true,
//       },
//     });
//     if (!updatedZone) {
//       throw new AppError('Zone not found', 404);
//     }
//     updatedZone.name = name;
//     updatedZone.deliveryCharges = deliveryCharges;
//     if (minOrderValue) {
//       updatedZone.minOrderValue = minOrderValue;
//     }
//
//     for (const pincode of pincodes) {
//       const pincodeEntity = await Pincode.findOne({
//         where: {
//           id: pincode,
//         },
//       });
//       if (!pincodeEntity)
//         return res.status(404).json({
//           status: 'error',
//           message: 'Pincode not found',
//         });
//       if (!updatedZone.pincodes.includes(pincodeEntity))
//         updatedZone.pincodes.push(pincodeEntity);
//     }
//     updatedZone.pincodes = updatedZone.pincodes.filter(pincode =>
//       pincodes.some(id => id === pincode.id),
//     );
//     for (const shop of products) {
//       const productEntity = await Product.findOne({
//         where: {
//           id: shop,
//         },
//       });
//       if (!productEntity) throw new AppError('Product not found', 404);
//       if (!updatedZone.products.includes(productEntity))
//         updatedZone.products.push(productEntity);
//     }
//     updatedZone.products = updatedZone.products.filter(shop =>
//       products.some(id => id === shop.id),
//     );
//     await updatedZone.save();
//     return res.status(200).json({
//       status: 'success',
//       message: 'Zone updated successfully',
//       data: updatedZone,
//     });
//   },
// );

const getAllZones = catchAsync(async (req: Request, res: Response) => {
  const zones = await Zone.find({
    relations: {
      pincodes: true,
      products: true,
    },
  });
  return res.status(200).json({
    status: 'success',
    data: zones,
  });
});

const uploadOrUpdateMultipleZones = catchAsync(
  async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;
    if (!file) {
      throw new AppError('Upload file not found', 404);
    }
    try {
      const zones = await readEcexl(file.path);
      for (let key of Object.keys(zones)) {
        //Check zone with name is exist or not
        let zone = await Zone.findOne({
          where: {
            name: key.trim(),
          },
        });
        if (!zone) {
          zone = Zone.create({
            name: key.trim(),
            deliveryCharges: 0,
          });
          await zone.save();
        }
        if (!zone.pincodes) {
          zone.pincodes = [];
        }
        const pincodes = zones[key];

        const filterPinCodes = removeDuplicateAndNull(pincodes);
        zone.pincodes =
          await pincodeController.checkPinCodesExistOrAdd(filterPinCodes);
        await zone.save();
      }
      return res.status(200).json({
        status: 'success',
      });
    } catch (e) {
      throw new AppError('Invalid file', 400);
    } finally {
      await fs.unlink(file.path);
    }
  },
);

const deleteZoneById = catchAsync(
  async (req: Request<{ id: string }, any, any>, res: Response) => {
    const zone = await Zone.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!zone) {
      throw new AppError('Zone not found', 404);
    }
    await zone.remove();
    return res.status(200).json({
      status: 'success',
      message: 'Zone deleted successfully',
    });
  },
);
const getZoneByPincode = catchAsync(
  async (req: Request<{ pincode: string }, any, any>, res: Response) => {
    const zone = await Zone.findOne({
      where: [
        {
          pincodes: {
            pincode: req.params.pincode,
          },
        },
        {
          name: allIndiaFilter,
        },
      ],
    });
    if (!zone) {
      return res.status(200).json({
        status: 'success',
        data: {
          name: 'All India',
        },
      });
    }
    zone.pincodes = undefined;

    return res.status(200).json({
      status: 'success',
      data: zone,
    });
  },
);

export default {
  createNewZone,
  getAllZones,
  updateZoneById,
  uploadOrUpdateMultipleZones,
  deleteZoneById,
  getZoneByPincode,
};
