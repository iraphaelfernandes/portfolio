import { Injectable } from '@angular/core';
import { TranslocoLoader, Translation } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';
import english from '../../assets/i18n/en.json';
import french from '../../assets/i18n/fr.json';
import { Language } from '../shared/language';

@Injectable({ providedIn: 'root' })
export class AppTranslocoLoader implements TranslocoLoader {
  private readonly translations: Record<Language, Translation> = {
    en: english,
    fr: french,
  };

  getTranslation(language: string): Observable<Translation> {
    if (language !== 'en' && language !== 'fr') {
      throw new Error(`Unsupported translation language: ${language}`);
    }

    return of(this.translations[language]);
  }
}
