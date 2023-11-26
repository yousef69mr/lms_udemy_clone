import { db } from "@/lib/db";
import { Locale } from "@/next-i18next.config";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
}: {
  params: { lang: Locale; courseId: string };
}) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
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

  return redirect(
    `/${params.lang}/courses/${course.id}/chapters/${course.chapters[0].id}`
  );
};

export default CourseIdPage;
