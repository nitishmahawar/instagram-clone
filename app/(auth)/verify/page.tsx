import { redirect } from "next/navigation";
import React from "react";
import Verify from "./verify";

const Page = ({
  searchParams: { email },
}: {
  searchParams: { email: string };
}) => {
  if (!email) {
    redirect("/login");
  }
  return <Verify email={email} />;
};

export default Page;
