import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { NextUIProviders } from "@/components/providers/nextUi-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export const metadata: Metadata = {
  title: "Shopify Clone",
  description: "Created by Non-Stop Studio"
};


export default function RootLayout({
  children
}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
        <body>
          <NextUIProviders>
            <main>{children}</main>
            <Toaster />
            <NextSSRPlugin
              routerConfig={extractRouterConfig(ourFileRouter)}
            />
          </NextUIProviders>
        </body>
    </html>
  );
}