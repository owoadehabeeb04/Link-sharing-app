import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { userProps } from "@/dataTypes";
import { getShowUser } from "./api/user";
import "./globals.css";
import {
  StateContext,
  useStateContext,
} from "@/components/context/stateContext";
import { auth } from "@/utils/firebaseconfig";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Dev Link",
  description: "Link Sharing App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StateContext>
          <Toaster /> {children}
        </StateContext>
      </body>
    </html>
  );
}
