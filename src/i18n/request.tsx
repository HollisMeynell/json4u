import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "zh"];

export default getRequestConfig(async () => {
  const locale = "zh";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    defaultTranslationValues: {
      b: (children) => <b>{children}</b>,
      i: (children) => <i>{children}</i>,
      u: (children) => <u>{children}</u>,
      br: () => <br />,
    },
  };
});
