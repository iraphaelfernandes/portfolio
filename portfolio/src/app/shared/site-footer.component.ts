import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SITE_CONFIG } from '../site.config';
import { Language } from './language';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  protected readonly site = SITE_CONFIG;
  protected readonly year = new Date().getFullYear();

  readonly language = input<Language>('en');
}
