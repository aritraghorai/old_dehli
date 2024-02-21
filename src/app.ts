import 'reflect-metadata';
import express from 'express';
import router from './router/index.js';
import morgan from 'morgan';
import cors from 'cors';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import globalErrorHandler from './controller/globarError.controller.js';
import { myDataSource } from './utils/app-data-source.js';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import env from './utils/env.js';
import { Role, User } from './entities/user.entiry.js';
import {
  Option,
  OptionValue,
  Product,
  ProductCofiguration,
  ProductItem,
  ProductTag,
} from './entities/product.entity.js';
import { Category } from './entities/category.entity.js';
import { Image } from './entities/image.entity.js';
import { Order, OrderAddress, OrderItem } from './entities/order.entity.js';
import bcryptService from './services/bcrypt.service.js';

const app = express();

app.use(morgan('dev'));

app.use(cors());

await myDataSource.initialize();

app.use(express.json());

app.use('/public', express.static('public'));

app.use('/', router);

app.use(globalErrorHandler);

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

const authenticate = async (email: string, password: string) => {
  const user = await User.findOne({
    where: {
      phoneNumber: email,
    },
  });
  if (user && (await bcryptService.comparePassword(password, user.password))) {
    return user;
  }
  return null;
};

const start = async () => {
  const admin = new AdminJS({
    resources: [
      User,
      Product,
      Category,
      Image,
      Role,
      ProductItem,
      ProductCofiguration,
      ProductTag,
      Option,
      OptionValue,
      Order,
      OrderItem,
      OrderAddress,
    ],
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    },
  );
  app.use(admin.options.rootPath, adminRouter);

  app.listen(+env.PORT, '0.0.0.0', () => {
    console.log(
      `AdminJS started on http://localhost:${env.PORT}${admin.options.rootPath}`,
    );
  });
};

start();
