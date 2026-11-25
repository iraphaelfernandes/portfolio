import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Language } from './language';

@Component({
  selector: 'app-language-toggle',
  imports: [TranslocoPipe],
  templateUrl: './language-toggle.component.html',
  styleUrl: './language-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageToggleComponent {
  readonly language = input<Language>('en');
  readonly languageChange = output<Language>();

  protected selectLanguage(language: Language): void {
    this.languageChange.emit(language);
  }
}
