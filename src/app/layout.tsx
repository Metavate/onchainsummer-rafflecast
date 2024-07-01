"use client";

import "./globals.css";
import { ReactNode, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Sidebar from "@/components/Sidebar";
import PrivyProviderWrapper from "@/components/privy-provider-wrapper";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
// import Login from "@/components/Login";
// import Spinner from "@/components/Spinner";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {


  return (
    <html lang="en">
      <body className="overflow-hidden">
        <PrivyProviderWrapper>
          <div className="flex w-full max-w-[140rem] mx-auto h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 h-full">
              <Topbar appName={"RaffleCast"} />
              <main className="flex-1 p-4 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
