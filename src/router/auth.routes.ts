import authController from "@/controller/auth.controller";
import extractUser from "@/controller/extractUser";
import ValidateRequest from "@/middleware/ValidateRequest";
import { LoginValidator, RegisterSendOtpValidator, VerifyOtpValidator } from "@/validator/auth.validator";
import { Router } from "express";

const authRouter = Router()

authRouter.post("/register/sendOtp", ValidateRequest(RegisterSendOtpValidator), authController.registerAndSendOtp)
authRouter.post("/register/verifyOtp", ValidateRequest(VerifyOtpValidator), authController.verifyOtp)
authRouter.post("/login", ValidateRequest(LoginValidator), authController.login)

authRouter.use(extractUser)

authRouter.get("/me", authController.me)

export default authRouter
