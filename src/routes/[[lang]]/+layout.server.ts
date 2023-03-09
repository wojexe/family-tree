import type { LayoutServerLoad } from "./$types";

export const load = (({ request }) => {
  const lang = request.headers.get("accept-language");

  return { headerLang: lang ?? null };
}) satisfies LayoutServerLoad;
