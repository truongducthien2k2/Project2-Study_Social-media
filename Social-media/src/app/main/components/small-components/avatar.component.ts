import { Component, Input } from '@angular/core';

@Component({
  selector: 'Avatar',
  template: `
    <div
      [ngClass]="{'border border-0 border-neutral-600': hasBorder, 'h-32 w-32': isLarge, 'h-12 w-12': !isLarge}"
      class="rounded-full hover:opacity-90 transition cursor-pointer relative">
      <img [src]="photoURL ? photoURL : '/assets/images/user.png'" class="object-cover rounded-full" alt="Avatar">
    </div>
  `,
  styles: []
})
export class AvatarComponent {
  @Input() userId: string = '';
  @Input() isLarge: boolean = false;
  @Input() hasBorder: boolean = false;
  @Input() photoURL: string = ''; 
}
