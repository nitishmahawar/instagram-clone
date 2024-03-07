"use client";
import { Compass, Home, PlusSquare, Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import UserAvatar from "./user-avatar";
import { useSession } from "next-auth/react";

const BottomNavbar = () => {
  const session = useSession();
  const user = session.data?.user;
  return (
    <nav className="py-2.5 flex justify-evenly items-center border-t bg-background">
      <Link href="/">
        <Home />
      </Link>
      <Link href="/">
        <Compass />
      </Link>
      <Link href="/">
        <Search />
      </Link>
      <button>
        <PlusSquare />
      </button>
      <Link href={`/${user?.username}`}>
        <UserAvatar className="size-8" />
      </Link>
    </nav>
  );
};

export default BottomNavbar;
