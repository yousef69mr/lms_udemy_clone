import i18nConfig, { Locale, isValidLocale } from "@/next-i18next.config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  params: {
    lang: Locale;
  };
}
const Page = (props: Props) => {
  const {
    params: { lang },
  } = props;

  // const cookieStore = cookies();
  // const currentLanguage = cookieStore.get("i18next") || null;

  // if (currentLanguage && isValidLocale(currentLanguage as unknown as Locale)) {
  //   return redirect(`/${currentLanguage}/dashboard`);
  // }

  //   console.log("home");
  if (!isValidLocale(lang)) {
    const cookieStore = cookies();
    const currentLanguage = cookieStore.get("i18next") || null;

    // console.log(currentLanguage)
    if (currentLanguage && isValidLocale(currentLanguage.value)) {
      return redirect(`/${currentLanguage.value}/dashboard`);
    }

    return redirect(`/${i18nConfig.defaultLocale}/dashboard`);
  }
  return redirect(`/${lang}/dashboard`);
};

export default Page;
