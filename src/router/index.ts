import { Router } from "express";
import authRouter from "./auth.routes.js";
import catagoryRouter from "./catagory.router.js";
import uploadRouter from "./upload.router.js";
import productRouter from "./product.routes.js";
import cardRouter from "./cart.router.js";


const router = Router()

router.use("/auth", authRouter)
router.use("/category", catagoryRouter)
router.use("/upload", uploadRouter)
router.use("/product", productRouter)
router.use("/user-card", cardRouter)


export default router