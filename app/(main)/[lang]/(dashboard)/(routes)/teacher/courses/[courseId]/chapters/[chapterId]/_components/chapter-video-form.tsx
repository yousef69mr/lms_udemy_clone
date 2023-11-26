"use client";

import * as z from "zod";
import axios from "axios";
// import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
// import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useTranslation } from "react-i18next";
import { dir } from "i18next";
import { Locale } from "@/next-i18next.config";
import { cn } from "@/lib/utils";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const { lang: locale } = useParams();

  const { t } = useTranslation();
  const constantsI18n = useTranslation("constants");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        {t("videoForm.titleText")}
        <Button
          onClick={toggleEdit}
          variant="ghost"
          className={cn(
            "capitalize",
            dir(locale as Locale) === "rtl" && "flex-row-reverse"
          )}
        >
          {isEditing && <>{constantsI18n.t("actions.cancel")}</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle
                className={cn(
                  "h-4 w-4",
                  dir(locale as Locale) === "rtl" ? " ml-2" : " mr-2"
                )}
              />

              {constantsI18n.t("actions.add", {
                instance: t("videoForm.title"),
              })}
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil
                className={cn(
                  "h-4 w-4",
                  dir(locale as Locale) === "rtl" ? " ml-2" : " mr-2"
                )}
              />
              {constantsI18n.t("actions.edit", {
                instance: t("videoForm.title"),
              })}
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2 w-full">
            {/* <MuxPlayer
              playbackId={initialData?.muxData?.playbackId || ""}
            /> */}
            <video
              src={initialData.videoUrl}
              controls
              className="h-full min-w-full"
            ></video>
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div
            className={cn(
              "text-xs text-muted-foreground mt-2",
              dir(locale as Locale) === "rtl" && "text-right"
            )}
          >
            {t("videoForm.inputs-placeholder.video")}
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div
          className={cn(
            "text-xs text-muted-foreground mt-2",
            dir(locale as Locale) === "rtl" && "text-right"
          )}
        >
          {t("videoForm.helper-texts.delay-error")}
        </div>
      )}
    </div>
  );
};
