import { Category } from '@/entities/category.entity.js';
import { Image } from '@/entities/image.entity.js';
import { categoryRepository } from '@/orm/datasources/index.js';
import AppError from '@/utils/AppError.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import {
  NewCategoryValidatorType,
  UpdateCategoryValidatorType,
} from '@/validator/category.validator.js';
import { NextFunction, Request, Response } from 'express';
import imageController from './image.controller.js';
import { tr } from '@faker-js/faker';

const createCatagory = catchAsync(
  async (
    req: Request<{}, {}, NewCategoryValidatorType>,
    res: Response,
    next: NextFunction,
  ) => {
    const { name, parentCategoryId, slug, description, image } = req.body;

    //check if slug already exists
    const slugExists = await categoryRepository.findOne({
      where: { slug },
    });

    if (slugExists) return next(new AppError('Slug already exists', 400));

    const NewCatagory = categoryRepository.create({
      name,
      slug,
      description,
    });

    // Check image is exist or not
    const imageObj = await Image.findOne({ where: { id: image } });

    if (!image) {
      throw new AppError('Image not found', 404);
    }

    NewCatagory.image = imageObj;

    if (parentCategoryId) {
      const findParentCategory =
        await categoryRepository.findOneById(parentCategoryId);
      if (findParentCategory) {
        NewCatagory.parent = findParentCategory;
      }
    }
    categoryRepository.save(NewCatagory);

    return res.status(201).json({
      status: true,
      data: NewCatagory,
    });
  },
);

const getAllCatagory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const catagory = await myDataSource.manager
      .getTreeRepository(Category)
      .findTrees({
        relations: ['parent', 'image'],
      });
    return res.status(200).json({
      status: true,
      data: catagory,
    });
  },
);
const getAllCatagoryAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const catagory = await categoryRepository.find({
      relations: {
        subCategories: true,
        parent: true,
        image: true,
      },
    });
    return res.status(200).json({
      status: true,
      data: catagory,
    });
  },
);

const updateCatagory = catchAsync(
  async (
    req: Request<{ id: string }, any, UpdateCategoryValidatorType>,
    res: Response,
  ) => {
    const { id } = req.params;
    const { name, description, slug, parentCategoryId, image } = req.body;
    const catagory = await Category.findOneById(id);
    if (!catagory) {
      return res.status(404).json({
        status: false,
        message: 'Catagory not found',
      });
    }
    catagory.name = name || catagory.name;
    catagory.description = description || catagory.description;
    catagory.slug = slug || catagory.slug;

    if (image) {
      const imageObj = await Image.findOne({ where: { id: image } });
      if (!imageObj) {
        throw new AppError('Image not found', 404);
      }
      await imageController.deleteImage(catagory.image.id);
      catagory.image = imageObj;
    }

    if (parentCategoryId) {
      const findParentCategory =
        await categoryRepository.findOneById(parentCategoryId);
      if (findParentCategory) {
        catagory.parent = findParentCategory;
      }
    }

    await categoryRepository.save(catagory);
    return res.status(200).json({
      status: true,
      data: catagory,
    });
  },
);

export default {
  createCatagory,
  getAllCatagory,
  getAllCatagoryAll,
  updateCatagory,
};
