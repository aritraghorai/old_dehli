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
import userRouter from './user.routes.js';
import favoriteRouter from './favorite.rotes.js';
import productTypeRouter from './productType.rotes.js';
import pincodeRouter from './pincode.router.js';
import zoneRouter from './zones.routes.js';
import timeSlotRouter from './timeslot.routes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/category', catagoryRouter);
router.use('/upload', uploadRouter);
router.use('/product', productRouter);
router.use('/user-card', cardRouter);
router.use('/user-favorite', favoriteRouter);
router.use('/shop', shopRouter);
router.use('/user-address', userAddressRouter);
router.use('/order', orderRouter);
router.use('/product-tag', productTagRouter);
router.use('/product-option', productOptionRoute);
router.use('/product-type', productTypeRouter);
router.use('/user', userRouter);
router.use('/pin-code', pincodeRouter);
router.use('/zones', zoneRouter);
router.use('/timeslot', timeSlotRouter);

export default router;
