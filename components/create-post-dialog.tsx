"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { UploadDropzone } from "./uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
  description: z
    .string()
    .min(1, { message: "Please provide image description" }),
});

const CreatePostDialog = () => {
  const { open, setOpen } = usePostDialog();
  const [imageUrl, setImageUrl] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      description: "",
    },
  });

  const router = useRouter();

  const { mutate, isLoading } = api.post.createPost.useMutation({
    onSuccess(data, variables, context) {
      toast.success("Post created");
      setOpen(false);
    },
    onError(error, variables, context) {
      toast.error(error.message);
    },
    onSettled(data, error, variables, context) {
      router.refresh();
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {imageUrl ? (
              <div className="aspect-square w-full max-w-sm mx-auto relative">
                <Image fill alt="image" src={imageUrl} />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          setImageUrl(res[0].url);
                          field.onChange(res[0].url);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Image description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button disabled={isLoading} type="submit">
                {isLoading && (
                  <Loader size={20} className="mr-2 animate-spin" />
                )}
                Create Post
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
