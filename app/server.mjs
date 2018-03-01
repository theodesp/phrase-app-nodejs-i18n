import express from 'express';
import consolidate from 'consolidate';
import cookieParser from 'cookie-parser';

export class Server {
  constructor({i18nProvider, localeService}) {
    this.express = express();
    this.express.disable('x-powered-by');

    this.express.use(cookieParser());
    this.express.use(i18nProvider.init);
    this.express.use(localeService.getMiddleWare());
    // setup mustache to parse .html files
    this.express.set('view engine', 'html');
    this.express.engine('html', consolidate.mustache);

    //https://github.com/janl/mustache.js#functions
    this.express.use((req, res, next) => {
      // mustache helper
      res.locals.i18n = () => (text, render) => req.__(text, render);
      next();
    });

    //https://github.com/janl/mustache.js#functions
    this.express.use((req, res, next) => {
      // mustache helper
      res.locals.i18np = () => (text, render) => {
        const parts = text.split(',');
        if (parts.length > 1) {
          const renderedCount = render(parts[1]);
          return req.__n(parts[0], renderedCount, render)
        }
      };
      next();
    });

    this.express.get('/:name?', (req, res) => {
      const name = req.params.name;

      res.render('index', {
        'currentLocale': res.locale,
        'name': name || 'Theo',
        'hello': req.__('Hello'),
        'messageCount': 5,
        'message': req.__('How are you?')
      });
    });
  }

  start() {
    return new Promise((resolve) => {
      const http = this.express.listen(8000, () => {
        const { port } = http.address();
        console.info(`[p ${process.pid}] Listening at port ${port}`);
        resolve();
      });
    });
  }
}
