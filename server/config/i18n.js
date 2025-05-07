const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require("i18next-http-middleware");
const path = require("path");
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    preload: ["en", "fr", "ar"], 
    backend: {
      loadPath: path.join(__dirname, "../locales/{{lng}}.json"), 
    },
    detection: {
      order: ["querystring", "cookie", "header"], 
      lookupQuerystring: "lng", 
      lookupCookie: "preferredLanguage",
      caches: ["cookie"], 
      cookieMinutes: 43200,
      //cookieSecure: true, // Only send over HTTPS
      //cookieSameSite: "Strict", // Prevent CSRF attacks
    },
  });

module.exports = i18next;
