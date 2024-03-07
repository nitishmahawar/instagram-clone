import React from "react";
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { User } from "lucide-react";

const Avatar = ({
  imageUrl,
  className,
}: {
  imageUrl?: string;
  className?: string;
}) => {
  return (
    <AvatarComponent className={className}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </AvatarComponent>
  );
};

export default Avatar;
