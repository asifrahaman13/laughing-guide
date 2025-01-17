import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  console.log(googleClientId)
  return (
    <html lang="en">
      <body className={``}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <Providers>{children}</Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
