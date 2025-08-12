"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Retry failed requests 3 times
                retry: 3,
                // Retry delay increases exponentially
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                // Refetch on window focus (good for keeping data fresh)
                refetchOnWindowFocus: true,
                // Refetch on reconnect
                refetchOnReconnect: true,
                // Don't refetch on mount if data is fresh
                refetchOnMount: true,
                // Stale time - how long data is considered fresh
                staleTime: 5 * 60 * 1000, // 5 minutes
                // Garbage collection time - how long to keep unused data in memory
                gcTime: 10 * 60 * 1000, // 10 minutes
            },
            mutations: {
                // Retry failed mutations
                retry: 2,
                // Retry delay for mutations
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
            },
        },
    }));

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
} 