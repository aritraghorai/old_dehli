import { Category } from '@/entities/category.entity.js';
import { categoryRepository } from '@/orm/datasources/index.js';
import AppError from '@/utils/AppError.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import {
  NewCategoryValidatorType,
  UpdateCategoryValidatorType,
} from '@/validator/category.validator.js';
import { NextFunction, Request, Response } from 'express';

const createCatagory = catchAsync(
  async (
    req: Request<{}, {}, NewCategoryValidatorType>,
    res: Response,
    next: NextFunction,
  ) => {
    const { name, parentCategoryId, slug, description } = req.body;

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
        relations: ['parent'],
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
    const { name, description, slug, parentCategoryId } = req.body;
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
