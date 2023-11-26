"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/ui/combobox";
import { useTranslation } from "react-i18next";
import { dir } from "i18next";
import { Locale } from "@/next-i18next.config";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const { lang: locale } = useParams();
  const { t } = useTranslation();
  const constantsI18n = useTranslation("constants");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || "",
    },
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

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {t("categoryForm.titleText")}
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
              {constantsI18n.t("actions.edit", {
                instance: t("categoryForm.title"),
              })}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || t('categoryForm.inputs-default.category')}
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={...options} {...field} />
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
                {isSubmitting
                  ? t("categoryForm.loading")
                  : t("categoryForm.submit")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
