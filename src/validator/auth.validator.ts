import { z } from "zod";

export const RegisterSendOtpValidator = z.object({
  name: z.string().min(3).max(255),
  phoneNumber: z.string().min(10).max(10),
  password: z.string().min(6).max(255)
})

export type RegisterSendOtpValidatorType = z.infer<typeof RegisterSendOtpValidator>

export const VerifyOtpValidator = z.object({
  phoneNumber: z.string().min(10).max(10),
  otp: z.string().min(6).max(6)
})

export type VerifyOtpValidatorType = z.infer<typeof VerifyOtpValidator>

export const LoginValidator = z.object({
  phoneNumber: z.string().min(10).max(10),
  password: z.string().min(6).max(255)
})

export type LoginValidatorType = z.infer<typeof LoginValidator>
