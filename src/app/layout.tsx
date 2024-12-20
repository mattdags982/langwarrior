import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import { AuthProvider } from "./AuthContext";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "LangWarrior";
const APP_DEFAULT_TITLE = "LangWarrior";
const APP_TITLE_TEMPLATE = "LangWarrior";
const APP_DESCRIPTION = "Learn spanish through comprehension input";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <Head>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>
        <body className={inter.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}
