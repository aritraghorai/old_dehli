import authController from "@/controller/auth.controller.js";
import extractUser from "@/controller/extractUser.js";
import ValidateRequest from "@/middleware/ValidateRequest.js";
import ValidateRequestNew from "@/middleware/ValidateRequestNew.js";
import { ForgotPasswordValidator, LoginValidator, RegisterSendOtpValidator, ResetPasswordValidator, VerifyOtpValidator } from "@/validator/auth.validator.js";
import { Router } from "express";

const authRouter = Router()

authRouter.post("/register/sendOtp", ValidateRequest(RegisterSendOtpValidator), authController.registerAndSendOtp)
authRouter.post("/register/verifyOtp", ValidateRequest(VerifyOtpValidator), authController.verifyOtp)
authRouter.post("/login", ValidateRequest(LoginValidator), authController.login)
authRouter.post("/forgotPassword", ValidateRequestNew({
  reqBodySchema: ForgotPasswordValidator
}), authController.forgotPassword)
authRouter.post("/resetPassword", ValidateRequestNew({
  reqBodySchema: ResetPasswordValidator
}), authController.resetPassword)

authRouter.use(extractUser)

authRouter.get("/me", authController.me)

export default authRouter
