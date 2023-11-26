import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  LayoutDashboard,
  Video,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterActions } from "./_components/chapter-actions";
import { Locale } from "@/next-i18next.config";
import { ServerTranslation } from "@/lib/i18n";
import TranslationsProvider from "@/components/providers/translation-provider";
import { dir } from "i18next";
import { cn } from "@/lib/utils";

export const charpterNamespaces = ["chapter"];

const ChapterIdPage = async ({
  params,
}: {
  params: { lang: Locale; courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const { t } = await ServerTranslation(params.lang, charpterNamespaces);

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <TranslationsProvider locale={params.lang} namespaces={charpterNamespaces}>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label={t('banners.unPublishedStatus')}
          locale={params.lang}
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/${params.lang}/teacher/courses/${params.courseId}`}
              className={cn(
                "flex items-center text-sm hover:opacity-75 transition mb-6",
                dir(params.lang) === "rtl" && "flex-row-reverse"
              )}
            >
              {dir(params.lang) === "ltr" ? (
                <ArrowLeft className="h-4 w-4 mr-2" />
              ) : (
                <ArrowRight className="h-4 w-4 ml-2" />
              )}
              
              {t("sections.labels.backButton")}
            </Link>
            <div
              className={cn(
                "flex items-center justify-between w-full",
                dir(params.lang) === "rtl" && "flex-row-reverse"
              )}
            >
              <div className="flex flex-col gap-y-2">
                <h1
                  className={cn(
                    "text-2xl font-medium",
                    dir(params.lang) === "rtl" && "text-right"
                  )}
                >
                  {t("sections.labels.headerTitle")}
                </h1>
                <span className="text-sm text-slate-700">
                  {t("sections.labels.headerSubtitle")} {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div
                className={cn(
                  "flex items-center gap-x-2",
                  dir(params.lang) === "rtl" && "flex-row-reverse"
                )}
              >
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">{t("sections.labels.main-data")}</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div>
              <div
                className={cn(
                  "flex items-center gap-x-2",
                  dir(params.lang) === "rtl" && "flex-row-reverse"
                )}
              >
                <IconBadge icon={Eye} />
                <h2 className="text-xl">{t("sections.labels.settings")}</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
          </div>
          <div>
            <div
              className={cn(
                "flex items-center gap-x-2",
                dir(params.lang) === "rtl" && "flex-row-reverse"
              )}
            >
              <IconBadge icon={Video} />
              <h2 className="text-xl">{t("sections.labels.video")}</h2>
            </div>
            <ChapterVideoForm
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </TranslationsProvider>
  );
};

export default ChapterIdPage;
