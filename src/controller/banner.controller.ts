import { Banner } from '@/entities/banner.entity.ts';
import { Category } from '@/entities/category.entity.ts';
import { Image } from '@/entities/image.entity.ts';
import AppError from '@/utils/AppError.ts';
import catchAsync from '@/utils/catchAsync.ts';
import { CreateBannerInput } from '@/validator/banner.validator.ts';
import { Request, Response } from 'express';
import imageController from './image.controller.ts';

const createBanner = catchAsync(
  async (req: Request<any, any, CreateBannerInput>, res: Response) => {
    const { name, image, category, position } = req.body;
    const imageFind = await Image.findOne({
      where: { id: image },
    });

    if (!imageFind) {
      throw new AppError('Image not found', 404);
    }

    const categoryFind = await Category.findOne({
      where: { id: category },
    });

    if (!categoryFind) {
      throw new AppError('Category not found', 404);
    }

    const banner = new Banner();
    banner.name = name;
    banner.image = imageFind;
    banner.category = categoryFind;
    if (position) {
      banner.position = position;
    }
    await banner.save();

    res.status(201).json({
      status: true,
      data: banner,
      message: 'Banner Created Successfully',
    });
  },
);

const listBanners = catchAsync(async (req: Request, res: Response) => {
  const banners = await Banner.find();
  res.status(200).json({ status: true, data: banners });
});

const deleteBanner = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const banner = await Banner.findOne({ where: { id: req.params.id } });
    if (!banner) {
      throw new AppError('Banner not found', 404);
    }
    await Banner.delete({ id: req.params.id });
    await imageController.deleteImage(banner.image.id);
    res.status(204);
  },
);

export default {
  listBanners,
  createBanner,
  deleteBanner,
};
