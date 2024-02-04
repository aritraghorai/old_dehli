import catchAsync from '@/utils/catchAsync.js';
import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

interface ValidateRequestNewProps {
  reqBodySchema?: AnyZodObject;
  queryParamSchema?: any;
  paramSchema?: AnyZodObject;
}

const ValidateRequestNew = ({
  reqBodySchema,
  queryParamSchema,
  paramSchema,
}: ValidateRequestNewProps) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      if (reqBodySchema) req.body = await reqBodySchema.parseAsync(req.body);
      if (queryParamSchema) {
        req.query = await queryParamSchema.parseAsync(req.query);
      }
      if (paramSchema) {
        req.params = await paramSchema.parseAsync(req.params);
      }
      next();
    },
  );
};

export default ValidateRequestNew;
