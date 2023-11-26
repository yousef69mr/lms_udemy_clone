import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";
import { ServerTranslation } from "@/lib/i18n";
import { Locale } from "@/next-i18next.config";
import TranslationsProvider from "@/components/providers/translation-provider";
import { dir } from "i18next";
import { cn } from "@/lib/utils";
import { courseNamespaces } from "@/lib/namespaces";



const CourseIdPage = async ({
  params,
}: {
  params: { lang: Locale; courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { t } = await ServerTranslation(params.lang, courseNamespaces);

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <TranslationsProvider locale={params.lang} namespaces={courseNamespaces}>
      {!course.isPublished && (
        <Banner label={t("banners.unPublishedStatus")} locale={params.lang} />
      )}
      <div className="p-6">
        <div
          className={cn(
            "flex items-center justify-between",
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
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
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
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div
                className={cn(
                  "flex items-center gap-x-2",
                  dir(params.lang) === "rtl" && "flex-row-reverse"
                )}
              >
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">{t("sections.labels.chapters")}</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div
                className={cn(
                  "flex items-center gap-x-2",
                  dir(params.lang) === "rtl" && "flex-row-reverse"
                )}
              >
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">{t("sections.labels.price")}</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div
                className={cn(
                  "flex items-center gap-x-2",
                  dir(params.lang) === "rtl" && "flex-row-reverse"
                )}
              >
                <IconBadge icon={File} />
                <h2 className="text-xl">{t("sections.labels.attachments")}</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </TranslationsProvider>
  );
};

export default CourseIdPage;
