import TranslationsProvider from "@/components/providers/translation-provider";
import { teacherNamespaces } from "@/lib/namespaces";
import { isTeacher } from "@/lib/teacher";
import { Locale } from "@/next-i18next.config";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";



const TeacherLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) => {
  const { userId } = auth();

  if (!isTeacher(userId)) {
    return redirect("/");
  }

  return (
    <TranslationsProvider locale={params.lang} namespaces={teacherNamespaces}>
      {children}
    </TranslationsProvider>
  );
};

export default TeacherLayout;
