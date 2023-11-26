import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";
import { Locale } from "@/next-i18next.config";
import { ServerTranslation } from "@/lib/i18n";
import { teacherNamespaces } from "../layout";

interface Props {
  params: {
    lang: Locale;
  };
}

const AnalyticsPage = async ({ params }: Props) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { t } = await ServerTranslation(params.lang, teacherNamespaces);

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label={t("info-cards.labels.TotalRevenue")}
          value={totalRevenue}
          locale={params.lang}
          shouldFormat
        />
        <DataCard label={t("info-cards.labels.TotalSales")} value={totalSales} locale={params.lang} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
