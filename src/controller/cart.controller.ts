import { ProductItem } from '@/entities/product.entity.js';
import { CartItem, User, UserCart } from '@/entities/user.entiry.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import { AddToCartBody } from '@/validator/cart.validator.js';
import { NextFunction, Request, Response } from 'express';

const addToCart = catchAsync(
  async (
    req: Request<{}, {}, AddToCartBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const user = req.user as User;
    const { productItemId, quantity } = req.body;

    //Search Product Item exist or not
    const productItem = await ProductItem.findOne({
      where: { id: productItemId },
    });
    if (!productItem) {
      return next(new AppError('Product Item not found', 404));
    }

    //Search For cart
    let userCart = await UserCart.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    //If cart not found create new cart
    if (!userCart) {
      const newCart = UserCart.create({
        user: user,
      });
      userCart = await newCart.save();
    }
    //Add product to cart
    const cart = await UserCart.findOne({
      where: { user: user },
      relations: {
        cardItems: true,
      },
    });
    //Check if product already in cart
    const productInCart = await CartItem.findOne({
      where: {
        cart: {
          id: userCart.id,
        },
        productItem: {
          id: productItemId,
        },
      },
    });
    //If product already in cart update quantity
    if (productInCart) {
      productInCart.count = quantity;
      await productInCart.save();
    } else {
      //If product not in cart add product to cart
      const productCartItem = CartItem.create({
        productItem: {
          id: productItemId,
        },
        count: quantity,
        cart: {
          id: userCart.id,
        },
      });
      await productCartItem.save();
    }
    res.json({
      status: true,
      message: 'Product added to cart',
    });
  },
);

const getCurrentLoginUserCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const cart = await UserCart.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        cardItems: true,
      },
    });
    res.json({
      status: true,
      data: cart,
    });
  },
);
const clearCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    const cart = await UserCart.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }
    await CartItem.delete({
      cart: {
        id: cart.id,
      },
    });
    res.json({
      status: true,
      message: 'Cart cleared',
    });
  },
);
const deleteCartItem = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const cartItemId = req.params.id;
    const cardItem = await CartItem.findOne({
      where: {
        id: cartItemId,
      },
    });
    if (!cardItem) {
      throw new AppError('Cart Item not found', 404);
    }
    await CartItem.delete({
      id: cartItemId,
    });
    res.json({
      status: true,
      message: 'Cart Item deleted',
    });
  },
);

export default {
  addToCart,
  getCurrentLoginUserCart,
  clearCart,
  deleteCartItem,
};
