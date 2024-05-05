import bannerController from '@/controller/banner.controller.ts';
import extractUser from '@/controller/extractUser.ts';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.ts';
import { createBannerValidator } from '@/validator/banner.validator.ts';
import { praramIdValidator } from '@/validator/common.validator.ts';
import { Router } from 'express';

const bannerRouter = Router();

bannerRouter.use(extractUser);

bannerRouter
  .route('/')
  .get(bannerController.listBanners)
  .post(
    ValidateRequestNew({
      reqBodySchema: createBannerValidator,
    }),
    bannerController.createBanner,
  );

bannerRouter.delete(
  '/:id',
  ValidateRequestNew({
    paramSchema: praramIdValidator,
  }),
  bannerController.deleteBanner,
);

export default bannerRouter;
