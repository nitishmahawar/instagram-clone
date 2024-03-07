import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/Instagram_logo.svg";
const Navbar = () => {
  return (
    <nav className="h-16 shrink-0 border-b w-full px-4 flex items-center justify-between bg-background">
      <Link href="/">
        <Image
          className="h-10 w-auto dark:invert"
          height={50}
          width={200}
          src={logo}
          alt="logo"
        />
      </Link>
    </nav>
  );
};

export default Navbar;
