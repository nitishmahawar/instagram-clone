"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/Instagram_logo.svg";
import { Compass, Home, PlusSquare, Search, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { usePostDialog } from "@/hooks/use-post-dialog";

const Sidebar = () => {
  const session = useSession();
  const user = session.data?.user;
  const { setOpen } = usePostDialog();
  return (
    <aside className="h-screen w-60 border-r py-8 px-4 space-y-6">
      <Link className="block" href={"/"}>
        <Image
          className="h-10 w-auto dark:invert"
          height={50}
          width={200}
          src={logo}
          alt="logo"
        />
      </Link>

      <div className="flex flex-col gap-2.5">
        <Link
          className="flex p-2 text-lg items-center gap-4 hover:bg-accent rounded-lg font-medium transition-colors"
          href={"/"}
        >
          <Home />
          <span>Home</span>
        </Link>
        <Link
          className="flex p-2 text-lg items-center gap-4 hover:bg-accent rounded-lg font-medium transition-colors"
          href={"/search"}
        >
          <Search />
          <span>Search</span>
        </Link>
        <Link
          className="flex p-2 text-lg items-center gap-4 hover:bg-accent rounded-lg font-medium transition-colors"
          href={"/explore"}
        >
          <Compass />
          <span>Explore</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="flex p-2 text-lg items-center gap-4 hover:bg-accent rounded-lg font-medium transition-colors"
        >
          <PlusSquare />
          <span>Create</span>
        </button>
        <Link
          className="flex p-2 text-lg items-center gap-4 hover:bg-accent rounded-lg font-medium transition-colors"
          href={`/${user?.username}`}
        >
          <Avatar className="size-6">
            <AvatarImage src={user?.image!} />
            <AvatarFallback className="bg-transparent">
              <User />
            </AvatarFallback>
          </Avatar>

          <span>Profile</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
