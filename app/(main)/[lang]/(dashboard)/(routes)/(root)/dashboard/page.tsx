import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";

import { InfoCard } from "./_components/info-card";
import TranslationsProvider from "@/components/providers/translation-provider";
import { Locale } from "@/next-i18next.config";
import { ServerTranslation } from "@/lib/i18n";
import { dashboardNamespaces } from "@/lib/namespaces";

interface Props {
  params: { lang: Locale };
}



export default async function Dashboard(props: Props) {
  const {
    params: { lang },
  } = props;

  const { t } = await ServerTranslation(lang, dashboardNamespaces);

  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <TranslationsProvider locale={lang} namespaces={dashboardNamespaces}>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={Clock}
            label={t("info-cards.labels.InProgress")}
            numberOfItems={coursesInProgress.length}
            type={"course"}
            locale={lang}
          />
          <InfoCard
            icon={CheckCircle}
            label={t("info-cards.labels.Completed")}
            numberOfItems={completedCourses.length}
            variant="success"
            type={"course"}
            locale={lang}
          />
        </div>
        <CoursesList
          items={[...coursesInProgress, ...completedCourses]}
          locale={lang}
        />
      </div>
    </TranslationsProvider>
  );
}
