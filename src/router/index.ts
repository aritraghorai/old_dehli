import { Router } from 'express';
import authRouter from './auth.routes.js';
import catagoryRouter from './catagory.router.js';
import uploadRouter from './upload.router.js';
import productRouter from './product.routes.js';
import cardRouter from './cart.router.js';
import shopRouter from './shop.routes.js';
import userAddressRouter from './userAddress.router.js';
import orderRouter from './order.routes.js';
import productTagRouter from './productTag.routes.js';
import productOptionRoute from './productOption.routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/category', catagoryRouter);
router.use('/upload', uploadRouter);
router.use('/product', productRouter);
router.use('/user-card', cardRouter);
router.use('/shop', shopRouter);
router.use('/user-address', userAddressRouter);
router.use('/order', orderRouter);
router.use('/product-tag', productTagRouter);
router.use('/product-option', productOptionRoute);

export default router;
