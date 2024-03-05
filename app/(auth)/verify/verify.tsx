"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { otpFormSchema, registerSchema } from "@/schemas";
import Image from "next/image";
import logo from "@/public/Instagram_logo.svg";
import { api } from "@/trpc/react";
import OTPInput from "@/components/otp-input";

const Verify = ({ email }: { email: string }) => {
  const form = useForm<z.infer<typeof otpFormSchema>>({
    defaultValues: {
      otp: "",
    },
    resolver: zodResolver(otpFormSchema),
  });

  const router = useRouter();

  const { mutate, isLoading } = api.auth.verifyEmail.useMutation({
    onSuccess(data, variables, context) {
      toast.success("Email verified");
      router.push("/login");
    },
    onError(error, variables, context) {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    mutate({ email, otp: values.otp });
  };

  return (
    <Card>
      <CardHeader className="flex justify-center items-center">
        <Image
          className="w-auto max-w-36"
          src={logo}
          height={50}
          width={200}
          alt="logo"
        />
        <CardDescription className="text-center">
          A verification OTP is sent to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="otp"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <OTPInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-sm text-gray-600 dark:text-gray-400 pt-4 text-center">
          Have an account ?{" "}
          <Link className="text-primary font-medium" href="/login">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Verify;
