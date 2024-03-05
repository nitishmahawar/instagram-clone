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
import { registerSchema } from "@/schemas";
import Image from "next/image";
import logo from "@/public/Instagram_logo.svg";
import { api } from "@/trpc/react";

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const { mutate, isLoading } = api.auth.register.useMutation({
    onSuccess(data, variables, context) {
      router.push(`/verify?email=${variables.email}`);
    },
    onError(error, variables, context) {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    mutate(values);
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
        <CardDescription className="text-base font-medium text-center">
          Sign up to see photos and videos from your friends.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="name"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Fullname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="space-y-1 mt-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem className="space-y-1 mt-4">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
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
                  <FormLabel>Password</FormLabel>

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
                "Register"
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

export default Register;
