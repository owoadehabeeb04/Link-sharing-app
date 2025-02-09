"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StateContext } from "@/components/context/stateContext";
import { Toaster } from "react-hot-toast";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <StateContext>
        <Toaster />
        {children}
      </StateContext>
    </QueryClientProvider>
  );
};

export default Providers;