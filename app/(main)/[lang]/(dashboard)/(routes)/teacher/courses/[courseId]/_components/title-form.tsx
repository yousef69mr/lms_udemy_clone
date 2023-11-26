"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { dir } from "i18next";
import { Locale } from "@/next-i18next.config";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const { lang: locale } = useParams();
  const { t } = useTranslation();
  const constantsI18n = useTranslation('constants');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div
        className={cn(
          "font-medium flex items-center justify-between"
          // dir(locale as Locale) === "rtl" && "flex-row-reverse"
        )}
      >
        {t("titleForm.titleText")}
        <Button
          onClick={toggleEdit}
          variant="ghost"
          className={cn(
            "capitalize",
            dir(locale as Locale) === "rtl" && "flex-row-reverse"
          )}
        >
          {isEditing ? (
            <>{constantsI18n.t("actions.cancel")}</>
          ) : (
            <>
              <Pencil
                className={cn(
                  "h-4 w-4",
                  dir(locale as Locale) === "rtl" ? " ml-2" : " mr-2"
                )}
              />
              {constantsI18n.t("actions.edit", { instance: t("titleForm.title") })}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2"
            // dir(locale as Locale) === "rtl" && "text-right"
          )}
        >
          {initialData.title}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder={t("titleForm.inputs-placeholder.title")}
                      className={cn(
                        dir(locale as Locale) === "rtl" &&
                          "placeholder:text-right"
                      )}
                      {...field}
                    />
                  </FormControl>
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
              <Button disabled={!isValid || isSubmitting} type="submit">
                {isSubmitting ? t("titleForm.loading") : t("titleForm.submit")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
