import bannerController from '@/controller/banner.controller.js';
import extractUser from '@/controller/extractUser.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import { createBannerValidator } from '@/validator/banner.validator.js';
import { praramIdValidator } from '@/validator/common.validator.js';
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
