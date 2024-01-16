import express from 'express'
import router from './router'
import env from './utils/env';
import morgan from 'morgan';
import globalErrorHandler from './controller/globarError.controller';


const app = express()

app.use(morgan('dev'))

app.use(express.json())

app.use("/", router);

app.use(globalErrorHandler)

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
})




