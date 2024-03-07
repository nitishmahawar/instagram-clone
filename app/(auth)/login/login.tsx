"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Eye, EyeOff, Loader } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/schemas";
import Image from "next/image";
import logo from "@/public/Instagram_logo.svg";

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      emailOrUsername: values.emailOrUsername,
      password: values.password,
      redirect: false,
      callbackUrl: "/",
    });
    setIsLoading(false);
    if (!res?.ok) {
      toast.error(res?.error);
    }
    router.refresh();
    router.push("/");
  };

  return (
    <Card>
      <CardHeader className="flex justify-center items-center">
        <Image
          className="w-auto max-w-44"
          src={logo}
          height={50}
          width={200}
          alt="logo"
        />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="emailOrUsername"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email Or Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email or username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="space-y-1 mt-4">
                  <div className="flex justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      className=" text-xs capitalize text-muted-foreground hover:text-primary/90 transition-colors font-medium"
                      href="/reset-password"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <FormControl>
                      <Input
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute top-2.5 right-2.5 text-muted-foreground"
                      onClick={() => setIsPasswordVisible((ipv) => !ipv)}
                    >
                      {isPasswordVisible ? (
                        <EyeOff strokeWidth={1.5} size={20} />
                      ) : (
                        <Eye strokeWidth={1.5} size={20} />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-sm text-gray-600 dark:text-gray-400 pt-4 text-center">
          Don&apos;t have an account ?{" "}
          <Link className="text-primary font-medium" href="/register">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Login;
