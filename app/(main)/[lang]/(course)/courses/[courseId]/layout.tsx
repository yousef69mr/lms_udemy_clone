import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import { dir } from "i18next";
import { Locale } from "@/next-i18next.config";
import { cn } from "@/lib/utils";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale; courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className="h-full">
      <div
        className={cn(
          "h-[80px] fixed inset-y-0 w-full z-50",
          dir(params.lang) === "ltr" ? "md:pl-80" : "md:pr-80"
        )}
      >
        <CourseNavbar course={course} progressCount={progressCount} locale={params.lang} />
      </div>
      <div
        className={cn(
          "hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50",
          dir(params.lang) === "rtl" && "right-0"
        )}
      >
        <CourseSidebar locale={params.lang} course={course} progressCount={progressCount} />
      </div>
      <main
        className={cn(
          "pt-[80px] h-full",
          dir(params.lang) === "ltr" ? "md:pl-80" : "md:pr-80"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
