import catagoryController from "@/controller/catagory.controller.js";
import ValidateRequest from "@/middleware/ValidateRequest.js";
import { NewCategoryValidator } from "@/validator/category.validator.js";
import { Router } from "express";

const catagoryRouter = Router()

catagoryRouter.post('/', ValidateRequest(NewCategoryValidator), catagoryController.createCatagory)
catagoryRouter.get('/', catagoryController.getAllCatagory)


export default catagoryRouter
