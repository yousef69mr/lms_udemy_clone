import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Locale } from "@/next-i18next.config";
import { dir } from "i18next";

interface DataCardProps {
  value: number;
  label: string;
  locale: Locale;
  shouldFormat?: boolean;
}

export const DataCard = ({
  value,
  label,
  locale,
  shouldFormat,
}: DataCardProps) => {
  return (
    <Card>
      <CardHeader
        className={cn(
          "flex items-center justify-between space-y-0 pb-2",
          dir(locale) === "rtl" ? "flex-row-reverse" : "flex-row"
        )}
      >
        <CardTitle className="text-sm font-medium capitalize">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-2xl font-bold",
            dir(locale) === "rtl" && "text-right"
          )}
        >
          {shouldFormat ? formatPrice(value) : value}
        </div>
      </CardContent>
    </Card>
  );
};
