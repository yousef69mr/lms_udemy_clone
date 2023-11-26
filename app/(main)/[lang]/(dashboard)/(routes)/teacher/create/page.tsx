"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { dir } from "i18next";
import { Locale } from "@/next-i18next.config";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const { lang: locale } = useParams();

  const { t } = useTranslation();
  const constantsI18n = useTranslation("constants");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/${locale}/teacher/courses/${response.data.id}`);
      toast.success("Course created");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={cn("max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6",dir(locale as Locale) === "rtl" && "flex-row-reverse")}>
      <div
        className={cn(
          "flex flex-col max-w-xl",
          dir(locale as Locale) === "rtl" && "items-end w-full text-right"
        )}
      >
        <h1 className="text-2xl">{t("createCourseForm.headerText")}</h1>
        <p className="text-sm text-slate-600">
          {t("createCourseForm.headerSubTitle")}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8 w-full"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createCourseForm.titleText")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder={t(
                        "createCourseForm.inputs-placeholder.title"
                      )}
                      className={cn(
                        dir(locale as Locale) === "rtl" &&
                          "placeholder:text-right"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("createCourseForm.helper-texts.title")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div
              className={cn(
                "flex items-center gap-x-2",
                dir(locale as Locale) === "rtl" && "flex-row-reverse"
              )}
            >
              <Link href="/">
                <Button type="button" variant="ghost">
                  {constantsI18n.t("cancel")}
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting
                  ? t("createCourseForm.loading")
                  : t("createCourseForm.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
