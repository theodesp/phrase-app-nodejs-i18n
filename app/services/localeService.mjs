import url from 'url';
/**
 * LocaleService
 */
export class LocaleService {
  /**
   *
   * @param i18nProvider The i18n provider
   */
  constructor(opts) {
    this.i18nProvider = opts.i18nProvider;
  }

  /**
   *
   * @returns {string} The current locale code
   */
  getCurrentLocale() {
    return this.i18nProvider.getLocale();
  }

  /**
   *
   * @returns string[] The list of available locale codes
   */
  getLocales() {
    return this.i18nProvider.getLocales();
  }

  /**
   *
   * @param locale The locale to set. Must be from the list of available locales.
   */
  setLocale(locale) {
    if (this.getLocales().indexOf(locale) !== -1) {
      this.i18nProvider.setLocale(locale)
    }
  }

  /**
   *
   * @param string String to translate
   * @param args Extra parameters
   * @returns {string} Translated string
   */
  translate(string, args = undefined) {
    return this.i18nProvider.__(string, args)
  }

  /**
   *
   * @param singular String to translate
   * @param plural String to translate
   * @param count The plural number
   * @returns {string} Translated string
   */
  translatePlurals(phrase, count) {
    return this.i18nProvider.__n(phrase, count)
  }

  /**
   *
   * @returns {Function} A middleware function to use with Web Frameworks.
   */
  getMiddleWare() {
    return (req, res, next) => {
      const queryParameter = 'lang';
      if (req.url) {
        const urlObj = url.parse(req.url, true);
        if (urlObj.query[queryParameter]) {
          const language = urlObj.query[queryParameter].toLowerCase();
          this.setLocale(language);
        }
      }
      next();
    }
  }
}