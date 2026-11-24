import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'default' | 'accent';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly label = input.required<string>();
  readonly variant = input<BadgeVariant>('default');
}
