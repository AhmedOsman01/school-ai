import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter, Outfit, Noto_Kufi_Arabic } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-kufi",
});

export const metadata: Metadata = {
  title: "EduFlow Egypt | نظام إدارة المدارس",
  description:
    "نظام إدارة المدارس الحديث والشامل - EduFlow Egypt School Management System",
  keywords: [
    "school management",
    "education",
    "Egypt",
    "إدارة المدارس",
    "نظام تعليمي",
  ],
  authors: [{ name: "EduFlow Egypt" }],
  openGraph: {
    title: "EduFlow Egypt",
    description: "Modern School Management System for Egypt",
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${notoKufiArabic.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

