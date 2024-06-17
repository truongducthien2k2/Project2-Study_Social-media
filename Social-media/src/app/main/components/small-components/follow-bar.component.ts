import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../interface';

@Component({
  selector: 'app-follow-bar',
  template: `
    <div class="px-6 py-4 hidden lg:block">
      <div class="bg-neutral-800 rounded-xl p-4  border border-0 border-neutral-600">
        <h2 class="text-white text-xl font-semibold">Who to follow?</h2>
        <div class="flex flex-col gap-6 mt-4">
          <!-- Thanh tìm kiếm -->
          <div class="flex items-center gap-2 flex-wrap">
            <input type="text" class="bg-black text-white border border-neutral-600 px-3 py-2 rounded focus:outline-none" [(ngModel)]="searchTerm" placeholder="Search..." (input)="searchUsers()">
            <button class="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
          </div>

          <!-- Danh sách người dùng -->
          <div class="flex justify-center align-middle" *ngIf="loading || !filteredUsers.length">
            <!-- Loader here -->
            <loader></loader>
          </div>
          <ng-container *ngFor="let user of filteredUsers">
            <a routerLink="/user/{{user.uid}}" *ngIf="user.uid != auth.loggedInUserId">
              <div class="flex flex-row gap-4">
                <!-- Avatar -->
                <Avatar [photoURL]="user.photoURL"></Avatar>
                <div class="flex flex-col">
                  <p class="text-white font-semibold text-sm">{{user.displayName}}</p>
                  <p class="text-neutral-400 text-sm">@{{user.username}}</p>
                </div>
              </div>
            </a>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FollowBarComponent implements OnInit {
  loading: boolean = false;
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService, public auth: AuthService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = this.getRandomUsers(users, 3); // Lấy ngẫu nhiên 3 người dùng ban đầu
    });
  }

  searchUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.getRandomUsers(this.users, 3); // Trả về danh sách người dùng ngẫu nhiên khi không có tìm kiếm
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      user.displayName.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
  }

  getRandomUsers(users: User[], count: number): User[] {
    const shuffled = users.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
