import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
    (click) = "onSubmit()"
      *ngIf="label"
      [disabled]="disabled" 
      [ngClass]="{
        'w-full': fullWidth,
        'w-fit': !fullWidth,
        'bg-white text-black border border-0 border-black': secondary,
        'bg-sky-500 text-white border border-sky-500': !secondary,
        'text-xl px-5 py-3': large,
        'text-md px-4 py-2': !large,
        'bg-transparent border border-white': outline,
        'bg-red-500': isBanButton,
        'bg-blue-400': !isBanButton
      }"
      class="disabled:opacity-70 disabled:cursor-not-allowed rounded-full font-semibold hover:opacity-80 transition">
      {{label}}
    </button>
  `,
  styles: [
  ]
})
export class ButtonComponent {
  @Input() label: string ='';
  @Input() fullWidth?: boolean;
  @Input() secondary?: boolean;
  @Input() isBanButton : boolean = false;
  @Input() large?: boolean;
  @Input() disabled?: boolean;
  @Input() outline?: boolean = false;

  @Output() formSubmitted : EventEmitter<void> = new EventEmitter<void>();

  onSubmit(): void {
    this.formSubmitted.emit();
  }
}