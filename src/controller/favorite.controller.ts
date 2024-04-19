import { ProductItem } from '@/entities/product.entity.js';
import { FavoriteItem, User, UserFavorite } from '@/entities/user.entiry.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import { AddToFavoriteInput } from '@/validator/favorite.validator.js';
import { NextFunction, Request, Response } from 'express';

const addToFavorite = catchAsync(
  async (
    req: Request<{}, {}, AddToFavoriteInput>,
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user as User;
    const { productItemId } = req.body;

    //Search Product Item exist or not
    const productItem = await ProductItem.findOne({
      where: { id: productItemId },
    });
    if (!productItem) {
      return next(new AppError('Product Item not found', 404));
    }

    //Search For cart
    let userFavorite = await UserFavorite.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    //If cart not found create new cart
    if (!userFavorite) {
      const newCart = UserFavorite.create({
        user: user,
      });
      userFavorite = await newCart.save();
    }
    //Add product to cart
    const userFavroute = await UserFavorite.findOne({
      where: { user: user },
      relations: {
        favoriteItems: true,
      },
    });
    //Check if product already in cart
    const favrouteItem = await FavoriteItem.findOne({
      where: {
        userFavorite: {
          id: userFavorite.id,
        },
        productItem: {
          id: productItemId,
        },
      },
    });
    //If product already in cart update quantity
    if (!favrouteItem) {
      //If product not in cart add product to cart
      const favoriteItem = FavoriteItem.create({
        productItem: {
          id: productItemId,
        },
        userFavorite: {
          id: userFavorite.id,
        },
      });
      await favoriteItem.save();
    }
    res.json({
      status: true,
      message: 'Favorite Item added to cart',
    });
  },
);

const getCurrentLoginFavorite = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const userFavortie = await UserFavorite.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        favoriteItems: {
          productItem: true,
        },
      },
    });
    res.json({
      status: true,
      data: userFavortie,
    });
  },
);
const clearFavorite = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const userFavorite = await UserFavorite.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    if (!userFavorite) {
      return next(new AppError('No Favorite found', 404));
    }
    await FavoriteItem.delete({
      userFavorite: {
        id: userFavorite.id,
      },
    });
    res.json({
      status: true,
      message: 'Favorite cleared',
    });
  },
);
const deleteFavoriteItem = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const favoriteItemId = req.params.id;
    const favoriteItem = await FavoriteItem.findOne({
      where: {
        id: favoriteItemId,
      },
    });
    if (!favoriteItem) {
      throw new AppError('FavoriteItem Item not found', 404);
    }
    await FavoriteItem.delete({
      id: favoriteItemId,
    });
    res.json({
      status: true,
      message: 'Favorite Item deleted',
    });
  },
);

export default {
  addToFavorite,
  getCurrentLoginFavorite,
  clearFavorite,
  deleteFavoriteItem,
};
