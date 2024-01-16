import catchAsync from "@/utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const ValidateRequest = (reqBodySchema: AnyZodObject) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    req.body = await reqBodySchema.parseAsync(req.body)
    next()
  })
}

export default ValidateRequest
