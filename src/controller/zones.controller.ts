import { Pincode, Zone } from '@/entities/address.entity.js';
import { Product } from '@/entities/product.entity.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import { NewZone } from '@/validator/zones.validator.js';
import { Request, Response } from 'express';

const createNewZone = catchAsync(
  async (req: Request<any, any, NewZone>, res: Response) => {
    const { name, pincodes = [], deliveryCharges, products = [] } = req.body;
    const newZone = Zone.create({
      name,
      deliveryCharges,
    });
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
    const { name, pincodes = [], deliveryCharges, products = [] } = req.body;
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
    updatedZone.name = name;
    updatedZone.deliveryCharges = deliveryCharges;

    for (const pincode of pincodes) {
      const pincodeEntity = await Pincode.findOne({
        where: {
          id: pincode,
        },
      });
      if (!pincodeEntity)
        return res.status(404).json({
          status: 'error',
          message: 'Pincode not found',
        });
      if (!updatedZone.pincodes.includes(pincodeEntity))
        updatedZone.pincodes.push(pincodeEntity);
    }
    updatedZone.pincodes = updatedZone.pincodes.filter(pincode =>
      pincodes.some(id => id === pincode.id),
    );
    for (const shop of products) {
      const productEntity = await Product.findOne({
        where: {
          id: shop,
        },
      });
      if (!productEntity) throw new AppError('Product not found', 404);
      if (!updatedZone.products.includes(productEntity))
        updatedZone.products.push(productEntity);
    }
    updatedZone.products = updatedZone.products.filter(shop =>
      products.some(id => id === shop.id),
    );
    await updatedZone.save();
    return res.status(200).json({
      status: 'success',
      message: 'Zone updated successfully',
      data: updatedZone,
    });
  },
)

const getAllZones = catchAsync(async (req: Request, res: Response) => {
  const zones = await Zone.find({
    relations: {
      pincodes: {
        postOffices: true,
      },
      products: true,
    },
  });
  return res.status(200).json({
    status: 'success',
    data: zones,
  });
});

export default {
  createNewZone,
  getAllZones,
  updateZoneById,
};
