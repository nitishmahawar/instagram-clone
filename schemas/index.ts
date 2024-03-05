import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

export const emailSchema = z
  .string()
  .email({ message: "Invalid email format" });

const passwordSchema = z
  .string()
  .regex(
    passwordRegex,
    "Password must be 8-20 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

export const registerSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50, { message: "Name must be between 2 and 50 characters long" }),
  email: emailSchema,
  username: z
    .string()
    .min(4, { message: "Username must be between 4 and 20 characters long" })
    .max(20, { message: "Username must be between 4 and 20 characters long" }),
  password: passwordSchema,
});

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(4)
    .max(50)
    .regex(
      /^(?=.*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)|^[a-zA-Z0-9_]{4,20}$/i,
      "Invalid email or username format"
    ),
  password: z
    .string()
    .min(8, { message: "Password must be 8 character long" })
    .max(20, { message: "Password must be less than 20 character" }),
});

const otpSchema = z
  .string()
  .length(6, { message: "OTP must be exactly 6 digits long" })
  .regex(/^\d{6}$/, { message: "OTP must contain only digits" });

export const verifyEmailSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const sendResetPasswordOtpSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  otp: otpSchema,
});

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be 8 character long" })
      .max(20, { message: "Password must be less than 20 character" }),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: `Passwords don't match`,
  });

export const otpFormSchema = z.object({
  otp: otpSchema,
});
