import catchAsync from "@/utils/catchAsync.js";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const ValidateRequest = (reqBodySchema?: AnyZodObject, queryParam?: AnyZodObject, param?: AnyZodObject) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    if (reqBodySchema)
      req.body = await reqBodySchema.parseAsync(req.body)
    if (queryParam) {
      req.query = await queryParam.parseAsync(req.query)
    }
    if (param) {
      req.params = await param.parseAsync(req.params)
    }
    next()
  })
}

export default ValidateRequest
