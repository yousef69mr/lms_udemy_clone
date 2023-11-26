"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { cn } from "@/lib/utils";
import { dir } from "i18next";
import { useTranslation } from "react-i18next";
import { Locale } from "@/next-i18next.config";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const { lang: locale } = useParams();

  const { t } = useTranslation();
  const constantsI18n = useTranslation("constants");

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
        {t("imageForm.titleText")}
        <Button
          onClick={toggleEdit}
          variant="ghost"
          className={cn(
            "capitalize",
            dir(locale as Locale) === "rtl" && "flex-row-reverse"
          )}
        >
          {isEditing && <>{constantsI18n.t("actions.cancel")}</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle
                className={cn(
                  "h-4 w-4",
                  dir(locale as Locale) === "rtl" ? " ml-2" : " mr-2"
                )}
              />
               {constantsI18n.t("actions.add", {
                instance: t("image.single"),
              })}
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil
                className={cn(
                  "h-4 w-4",
                  dir(locale as Locale) === "rtl" ? " ml-2" : " mr-2"
                )}
              />
               {constantsI18n.t("actions.edit", {
                instance: t("image.single"),
              })}
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div
            className={cn(
              "text-xs text-muted-foreground mt-4",
              dir(locale as Locale) === "rtl" && "text-right"
            )}
          >
            {t("imageForm.helper-texts.dimensions")}
          </div>
        </div>
      )}
    </div>
  );
};
