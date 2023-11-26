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
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { dir } from "i18next";
import { useTranslation } from "react-i18next";
import { Locale } from "@/next-i18next.config";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const { lang: locale } = useParams();

  const { t } = useTranslation();
  const constantsI18n = useTranslation("constants");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
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

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {t("priceForm.titleText")}
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
                instance: t("priceForm.title"),
              })}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.price && "text-slate-500 italic"
          )}
        >
          {initialData.price ? formatPrice(initialData.price) : t('priceForm.inputs-default.price')}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder={t("priceForm.inputs-placeholder.price")}
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
                {isSubmitting ? t("priceForm.loading") : t("priceForm.submit")}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
