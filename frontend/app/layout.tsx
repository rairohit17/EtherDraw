"use client";


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from "wagmi";
import { config } from './provider';
import { darkTheme, RainbowKitProvider, midnightTheme } from "@rainbow-me/rainbowkit";
import './globals.css'  // Add this import

import Header from "./components/Header";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <html lang="en" className="light">
      <body  className=" bg-gray-950 bg-cover bg-center w-full  min-h-screen bg-background">
        <main className="relative flex min-h-screen flex-col">
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider theme={darkTheme()}>
              <Header />

                {children}
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </main>
      </body>
    </html>
  );
}