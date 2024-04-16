import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-follow-bar',
  template: `
   <div class="px-6 py-4 hidden lg:block" >
    <div class="custom-background rounded-xl p-4 border">
      <h2 class="text-white text-xl font-semibold">Who to follow?</h2>
      <div class="flex flex-col gap-6 mt-4">
        <div class="flex justify-center align-middle">
          <!-- Loader here -->
        </div>
        <ng-container>
            <a>
          <div class="flex flex-row gap-4">
          <!-- Avatar -->
          <Avatar></Avatar>
            <div class="flex flex-col">
              <p class="text-white font-semibold text-sm">
                Fullname
              </p>
              <p class="text-neutral-400 text-sm">
                @Username
              </p>
            </div>
          </div>
        </a>
        </ng-container>
      </div>
    </div>
   </div>
  `,
  styles: [
    `
    .custom-background {
      background-color: #9ca69e;
    }
    `
  ]
})
export class FollowBarComponent implements OnInit {
  loading: boolean = false;

  constructor() { }

  ngOnInit(): void {}
}
