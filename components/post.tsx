"use client";
import React, { FC, useState } from "react";
import Avatar from "./avatar";
import { Button } from "./ui/button";
import {
  BadgeCheck,
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import Image from "next/image";
import { Post as PostType, User } from "@prisma/client";
import { cn, formatNumber } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PostProps extends PostType {
  author: User;
}

const Post: FC<PostProps> = ({
  id,
  totalLikes,
  imageUrl,
  createdAt,
  description,
  author: { username, image, isVerified },
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(true);
  const { mutate, isLoading } = api.post.like.useMutation({
    onSuccess(data, variables, context) {
      setIsLiked(true);
    },
    onError(error, variables, context) {
      toast.error(error.message);
    },
    onSettled(data, error, variables, context) {
      router.refresh();
    },
  });

  return (
    <div className="max-w-md">
      <div className="flex justify-between items-center py-2.5">
        <div className="flex gap-3 items-center text-sm">
          <Avatar className="size-8" imageUrl={image!} />
          <div className="font-medium flex items-center gap-1">
            {username}{" "}
            {isVerified && (
              <BadgeCheck
                className="fill-blue-500 text-white dark:text-gray-950"
                size={18}
              />
            )}{" "}
            • <span className="font-normal">{"6h"}</span>
          </div>
        </div>

        <Button size="icon" variant="ghost">
          <MoreHorizontal size={20} />
        </Button>
      </div>
      <Image
        className="w-full"
        height={500}
        width={500}
        alt={id}
        src={imageUrl}
      />
      <div className=" py-2.5 space-y-2">
        <div className="flex justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => mutate({ postId: id })}>
              <Heart
                className={cn(isLiked ? "fill-pink-600 text-pink-600" : "")}
              />
            </button>
            <button>
              <MessageCircle />
            </button>
            <button>
              <Send />
            </button>
          </div>
          <button>
            <Bookmark />
          </button>
        </div>
        <div>
          <p className="font-medium">{formatNumber(totalLikes)} likes</p>
          <p className="text-accent-foreground text-sm">
            <span className="font-medium">{username}</span> {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
