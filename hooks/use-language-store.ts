import { Locale } from "@/next-i18next.config";
import { create } from "zustand";

type LanguageStore = {
  locale: Locale | null;
  onUpdate: (locale: Locale) => void;
  onReset: () => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  locale: null,
  onUpdate: (locale: Locale) => set({ locale: locale }),
  onReset: () => set({ locale: null }),
}));
