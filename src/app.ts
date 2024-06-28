import 'reflect-metadata';
import express from 'express';
import router from './router/index.js';
import morgan from 'morgan';
import cors from 'cors';
import globalErrorHandler from './controller/globarError.controller.js';
import { myDataSource } from './utils/app-data-source.js';
import env from './utils/env.js';

const app = express();

process.env.TZ = 'Asia/Calcutta';

app.use(morgan('dev'));

app.use(cors());

await myDataSource.initialize();

app.use(express.json());

app.use('/public', express.static('public'));
app.use('/static', express.static('static'));

app.use('/', router);

app.use(globalErrorHandler);

const start = async () => {
  app.listen(+env.PORT, '0.0.0.0', () => {
    console.log(
      `it's running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`,
    );
  });
};

start();
