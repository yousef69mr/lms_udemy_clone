"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { useParams, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";

import { SearchInput } from "./search-input";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { dir } from "i18next";
import LanguageToggle from "@/components/language-toggle-button";
// import { useEffect } from "react";

export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const params = useParams();

  const locale = params.lang;

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  // useEffect(() => {
  //   alert(params.lang);
  // }, [params.lang]);

  return (
    <div className="w-full flex flex-wrap items-center">
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div
        className={cn(
          "flex gap-x-2 flex-wrap",
          dir(locale as string) === "ltr"
            ? " ml-auto"
            : " mr-auto flex-row-reverse"
        )}
      >
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost" className="capitalize">
              <LogOut className="h-4 w-4 mr-2" />
              {t("exit")}
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href={`/${locale}/teacher/courses`}>
            <Button size="sm" variant="ghost">
              {t("navbar.localization.teacherMode.toggleText")}
            </Button>
          </Link>
        ) : null}
        <LanguageToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
