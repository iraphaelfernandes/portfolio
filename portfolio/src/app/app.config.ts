import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
} from '@angular/platform-browser';
import { provideTransloco, provideTranslocoMissingHandler } from '@jsverse/transloco';
import { AppTranslocoLoader } from './core/transloco.loader';
import { MissingTranslationErrorHandler } from './core/transloco-missing-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    ...provideTransloco({
      config: {
        availableLangs: ['en', 'fr'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: false,
        missingHandler: {
          logMissingKey: true,
          useFallbackTranslation: false,
          allowEmpty: false,
        },
      },
      loader: AppTranslocoLoader,
    }),
    provideTranslocoMissingHandler(MissingTranslationErrorHandler),
  ],
};
