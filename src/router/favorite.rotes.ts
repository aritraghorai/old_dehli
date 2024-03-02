import extractUser from '@/controller/extractUser.js';
import favoriteController from '@/controller/favorite.controller.js';
import ValidateRequest from '@/middleware/ValidateRequest.js';
import { praramIdValidator } from '@/validator/common.validator.js';
import { addToFavoriteValidator } from '@/validator/favorite.validator.js';
import { Router } from 'express';

const favoriteRouter = Router();

favoriteRouter.use(extractUser);

favoriteRouter.post(
  '/',
  ValidateRequest(addToFavoriteValidator),
  favoriteController.addToFavorite,
);
favoriteRouter.get('/', favoriteController.getCurrentLoginFavorite);
favoriteRouter.delete('/clear', favoriteController.clearFavorite);
favoriteRouter.delete(
  '/:id',
  ValidateRequest(undefined, undefined, praramIdValidator),
  favoriteController.deleteFavoriteItem,
);

export default favoriteRouter;
