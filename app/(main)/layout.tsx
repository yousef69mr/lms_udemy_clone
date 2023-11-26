
import type { Metadata } from "next";

// import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import { ConfettiProvider } from "@/components/providers/confetti-provider";

import i18nConfig, { Locale } from "@/next-i18next.config";
// import { dir } from "i18next";
import TranslationsProvider from "@/components/providers/translation-provider";



export const metadata: Metadata = {
  title: "Udemy Clone",
  description: "LMS Udemy Clone",
};

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ lang: locale }));
}

const mainNamespaces = ["common"];

export default function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}) {
  return (
    // <ClerkProvider>
    // <html lang={params.lang} dir={dir(params.lang)} suppressHydrationWarning>
    //   <body className={inter.className}>

    //   </body>
    // </html>
    // </ClerkProvider>

    <TranslationsProvider locale={params.lang} namespaces={mainNamespaces}>
      <ConfettiProvider />
      <ToastProvider />

      {children}
    </TranslationsProvider>
  );
}
