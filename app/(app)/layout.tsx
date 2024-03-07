import BottomNavbar from "@/components/bottom-navbar";
import CreatePostDialog from "@/components/create-post-dialog";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <main className="flex relative h-svh bg-background w-full">
        <CreatePostDialog />
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="grow overflow-y-auto">{children}</div>
        <div className="md:hidden fixed top-0 w-full">
          <Navbar />
        </div>
        <div className="fixed bottom-0 w-full md:hidden">
          <BottomNavbar />
        </div>
      </main>
    </ThemeProvider>
  );
};

export default AppLayout;
