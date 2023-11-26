import { cn } from "@/lib/utils";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { Locale } from "@/next-i18next.config";
import { dir } from "i18next";
import TranslationsProvider from "@/components/providers/translation-provider";

export const namespaces = ["constants"];

const DashboardLayout = ({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) => {
  return (
    <TranslationsProvider locale={lang} namespaces={namespaces}>
      <div className="h-full">
        <div
          className={cn(
            "h-[80px] fixed inset-y-0 w-full z-50",
            dir(lang) === "ltr" ? "md:pl-56" : "md:pr-56"
          )}
        >
          <Navbar locale={lang} />
        </div>
        <div
          className={cn(
            "hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50",
            dir(lang) === "rtl" && "right-0"
          )}
        >
          <Sidebar />
        </div>
        <main
          className={cn(
            " pt-[80px] h-full",
            dir(lang) === "ltr" ? "md:pl-56" : "md:pr-56"
          )}
        >
          {children}
        </main>
      </div>
    </TranslationsProvider>
  );
};

export default DashboardLayout;
