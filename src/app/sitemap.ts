import { MetadataRoute } from "next";
import { env } from "@/lib/env";

// https://next-intl-docs.vercel.app/docs/environments/metadata-route-handlers
export default function sitemap(): MetadataRoute.Sitemap {
  return [getEntry("/"), getEntry("/editor")];
}

function getEntry(pathname: string) {
  return {
    url: getUrl(pathname),
    lastModified: new Date(),
    alternates: {
      languages: {
        en: getUrl(pathname),
        zh: getUrl(pathname),
      },
    },
  };
}

function getUrl(pathname: string, appURL: string = env.NEXT_PUBLIC_APP_URL) {
  return `${appURL}/${pathname === "/" ? "" : pathname}`;
}
