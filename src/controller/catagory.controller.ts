import { Category } from '@/entities/category.entity.js';
import { categoryRepository } from '@/orm/datasources/index.js';
import AppError from '@/utils/AppError.js';
import { myDataSource } from '@/utils/app-data-source.js';
import catchAsync from '@/utils/catchAsync.js';
import { NewCategoryValidatorType } from '@/validator/category.validator.js';
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
      if (!findParentCategory) {
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
      .findTrees();
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

export default {
  createCatagory,
  getAllCatagory,
  getAllCatagoryAll,
};
