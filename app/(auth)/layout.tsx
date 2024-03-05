import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="max-w-[26rem] w-full">{children}</div>
    </main>
  );
};

export default AuthLayout;
