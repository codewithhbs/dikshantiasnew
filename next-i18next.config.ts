import path from "path";
/** @type {import('next-i18next').UserConfig} */
const nextI18NextConfig = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hi"], // English and Hindi
  },
  localePath: path.resolve("./public/locales"), // where translation files will be stored
};

export default nextI18NextConfig;
