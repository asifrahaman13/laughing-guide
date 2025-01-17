import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/StoreProvider";

export const metadata: Metadata = {
  title: "kelick",
  description: "HR payroll at your fingertips",
  icons: {
    icon: "/images/dashboard/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
