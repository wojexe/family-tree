import {
  getLocaleFromNavigator,
  getLocaleFromPathname,
  init,
  register,
} from "svelte-i18n";

register("en", () => import("../locale/en.json"));
register("pl", () => import("../locale/pl.json"));

init({
  fallbackLocale: "en",
  initialLocale:
    getLocaleFromPathname(/^\/(.*?)(\/.*|$)/g) ?? getLocaleFromNavigator(),
});
