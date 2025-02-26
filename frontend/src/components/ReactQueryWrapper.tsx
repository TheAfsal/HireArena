
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const ReactQueryWrapper = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(new QueryClient()); 

  useEffect(() => {
    if (!queryClient) {
      throw new Error("QueryClient is not available");
    }
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryWrapper;
