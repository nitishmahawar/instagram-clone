"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";

const UserAvatar = ({ className }: { className: string }) => {
  const session = useSession();
  const user = session.data?.user;
  return (
    <Avatar className={className}>
      <AvatarImage src={user?.image!} />
      <AvatarFallback>
        <User className="fill-primary" />
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
