import {
  getLocaleFromAcceptLanguageHeader,
  getLocaleFromNavigator,
  getLocaleFromPathname,
  init,
  waitLocale
} from "svelte-intl-precompile";

import { availableLocales, registerAll } from "$locales";

registerAll();

export const load = async ({ data }) => {
  init({
    initialLocale: selectLocale(availableLocales),
    fallbackLocale: getLocaleFromAcceptLanguageHeader(data.headerLang, availableLocales) ?? "en"
  });

  await waitLocale();

  return {};
};

const selectLocale = (availableLocales: string[]): string | undefined => {
  const localeFromPathname = getLocaleFromPathname(/^\/((\w\w)(-\w\w)?)/);

  if (localeFromPathname != null && availableLocales.includes(localeFromPathname ?? ""))
    return localeFromPathname;

  return getLocaleFromNavigator() ?? undefined;
};
