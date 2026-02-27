import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Kufi+Arabic:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
