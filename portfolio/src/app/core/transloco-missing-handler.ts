import { Injectable } from '@angular/core';
import { TranslocoMissingHandler, TranslocoMissingHandlerData } from '@jsverse/transloco';

@Injectable()
export class MissingTranslationErrorHandler implements TranslocoMissingHandler {
  handle(key: string, data: TranslocoMissingHandlerData): never {
    throw new Error(`Missing translation "${key}" for language "${data.activeLang}".`);
  }
}
