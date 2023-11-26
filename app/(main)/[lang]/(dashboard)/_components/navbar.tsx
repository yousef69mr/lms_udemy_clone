import { NavbarRoutes } from "@/components/navbar-routes";

import { MobileSidebar } from "./mobile-sidebar";
import { Locale } from "@/next-i18next.config";
import { cn } from "@/lib/utils";
import { dir } from "i18next";

interface Props {
  locale: Locale;
}
export const Navbar = ({ locale }: Props) => {
  return (
    <div
      className={cn(
        "p-4 border-b h-full flex items-center bg-white shadow-sm",
        dir(locale) === "rtl" && "flex-row-reverse"
      )}
    >
      <MobileSidebar locale={locale} />
      <NavbarRoutes />
    </div>
  );
};
