import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguageService } from './core/language.service';
import { Language } from './shared/language';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteHeaderComponent } from './shared/site-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteFooterComponent, SiteHeaderComponent, TranslocoPipe],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.css',
})
export class App {
  private readonly languageService = inject(LanguageService);
  protected readonly language = this.languageService.language;

  protected setLanguage(language: Language): void {
    this.languageService.switchLanguage(language);
  }
}
