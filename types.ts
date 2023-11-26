
import { Locale } from "./next-i18next.config";
import { ReactElement } from "react";

export type LanguageParamsProps = {
  params: {
    lang: Locale;
  };
};

export type Route = TranslatedRoute & {
  icon: ReactElement;
  href: string;
};

export type TranslatedRoute = {
  id: number;
  label: string;
};
