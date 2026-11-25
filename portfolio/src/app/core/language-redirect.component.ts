import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from './language.service';

@Component({
  selector: 'app-language-redirect',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageRedirectComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.isBrowser && this.document.defaultView?.location.pathname === '/') {
      void this.router.navigateByUrl(`/${this.languageService.language()}`, { replaceUrl: true });
    }
  }
}
