import extractUser from '@/controller/extractUser.js';
import productOptionController from '@/controller/productOption.controller.js';
import { Router } from 'express';

const productOptionRoute = Router();

productOptionRoute.use(extractUser);

productOptionRoute.get('/', productOptionController.getAllProductOptions);

export default productOptionRoute;
