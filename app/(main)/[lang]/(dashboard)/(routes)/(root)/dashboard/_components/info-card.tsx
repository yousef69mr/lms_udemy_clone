import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { Locale } from "@/next-i18next.config";
import { cn } from "@/lib/utils";
import { dir } from "i18next";
import { ServerTranslation } from "@/lib/i18n";

// import { mainNamespaces } from "@/app/(main)/layout";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
  type: string;
  locale: Locale;
}

export const InfoCard = async ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
  type,
  locale,
}: InfoCardProps) => {
  const { t } = await ServerTranslation(locale, ["common"]);
  return (
    <div
      className={cn(
        "border rounded-md flex flex-wrap items-center gap-x-2 p-3",
        dir(locale) === "rtl" && "flex-row-reverse"
      )}
    >
      <IconBadge variant={variant} icon={Icon} />
      <div className="capitalize">
        <p className="font-medium">{label}</p>
        <p
          className={cn(
            "flex text-gray-500 text-sm capitalize",
            dir(locale) === "rtl" && "flex-row-reverse"
          )}
        >
          <span className="inline-block mx-1">{numberOfItems}</span>{" "}
          <span>
            {numberOfItems === 1 ? t(`${type}.single`) : t(`${type}.plural`)}
          </span>
        </p>
      </div>
    </div>
  );
};
