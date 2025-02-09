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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "@/providers";

export const metadata: Metadata = {
  title: "Dev Link",
  description: "Link Sharing App",
};
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
