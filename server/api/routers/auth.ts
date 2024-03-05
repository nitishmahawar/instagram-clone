import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendResetPasswordOtpSchema,
  verifyEmailSchema,
} from "@/schemas";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { mailer } from "@/lib/nodemailer";
import { generateOTP, isDateExpired } from "@/lib/utils";
import { User } from "@prisma/client";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { prisma } = ctx;
    const { emailOrUsername, password } = input;

    const isEmail = emailSchema.safeParse(emailOrUsername);

    let user: User | null;

    if (isEmail.success) {
      user = await prisma.user.findUnique({
        where: { email: emailOrUsername },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { username: emailOrUsername },
      });
    }

    if (!user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User not exits with this email or username",
      });
    }

    if (!user.emailVerified) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Please verify your email",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid password",
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
    };
  }),

  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, name, password, username } = input;
      const { prisma } = ctx;
      // checking for user

      const userFromEmail = await prisma.user.findUnique({ where: { email } });

      if (userFromEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exits with this email",
        });
      }

      const userFromUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (userFromUsername) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exits with this username",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { email, username, name, password: hashedPassword },
      });

      const now = new Date();

      const verificationToken = await prisma.verificationToken.create({
        data: {
          indentifier: email,
          expires: new Date(now.getTime() + 60 * 60 * 1000),
          token: generateOTP(),
        },
      });

      await mailer.sendMail({
        to: email, // Change to your recipient
        from: "nitish.mahawar@apttechsols.com", // Change to your verified sender
        subject: "Verify Your Email",
        text: `Please verify your email`,
        html: `<div>${verificationToken.token}</div>`,
      });

      return `Verification OTP sent to ${email}`;
    }),

  verifyEmail: publicProcedure
    .input(verifyEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { email, otp } = input;

      const verificationToken = await prisma.verificationToken.findUnique({
        where: { indentifier: email, token: otp },
      });

      if (!verificationToken) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid OTP" });
      }

      if (isDateExpired(verificationToken.expires)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "OTP is expired" });
      }

      await prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      });

      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return "Email verified successfully";
    }),

  sendResetPasswordOtp: publicProcedure
    .input(sendResetPasswordOtpSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { email } = input;

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not exits with this email",
        });
      }

      const now = new Date();

      const passwordReset = await prisma.passwordResetToken.create({
        data: {
          indentifier: email,
          expires: new Date(now.getTime() + 60 * 60 * 1000),
          token: generateOTP(),
        },
      });

      await mailer.sendMail({
        to: email, // Change to your recipient
        from: "nitish.mahawar@apttechsols.com", // Change to your verified sender
        subject: "Reset Your Password",
        text: `Reset Your Password`,
        html: `<div>${passwordReset.token}</div>`,
      });

      return `Verification OTP sent to ${email}`;
    }),

  resetPassword: publicProcedure
    .input(resetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { email, otp, password } = input;

      const resetPasswordToken = await prisma.passwordResetToken.findFirst({
        where: { indentifier: email, token: otp },
      });

      if (!resetPasswordToken) {
        throw new TRPCError({ code: "CONFLICT", message: "Invalid OTP" });
      }

      if (isDateExpired(resetPasswordToken.expires)) {
        throw new TRPCError({ code: "CONFLICT", message: "OTP is expired" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      await prisma.passwordResetToken.delete({
        where: { id: resetPasswordToken.id },
      });

      return "Password updated successfully";
    }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx;
      const { password, newPassword } = input;
      const userId = session.user.id;

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to update password user not exits",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password!);

      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          cause: "Invalid password",
        });
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHashedPassword },
      });

      return "Password updated successfully";
    }),
});
