import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { User } from '../interface';
import { Subscription } from 'rxjs';
import { ModelService } from '../shared/services/model.service';
import { ConfigService } from '../shared/services/config.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  isFollowed: boolean = false;
  followingCount: number = 0;
  followersCount: number = 0;
  user!: User;
  currentUserId: string = '';
  loading: boolean = false;
  isAdmin: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private config: ConfigService,
    public auth: AuthService,
    public modalService: ModelService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
        this.currentUserId = params.get('id') || '';
        this.isAdmin = this.currentUserId === this.auth.loggedInUserId;
        this.getCurrentUserProfileInfo();
        this.getFollowers();
        this.getFollowing();
        if (this.auth.isLoggedIn) {
          this.userService.checkIfFollowed(this.auth.loggedInUserId, this.currentUserId).subscribe((isFollowed) => {
            this.isFollowed = isFollowed;
          });
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getCurrentUserProfileInfo(): void {
    this.subscriptions.push(
      this.userService.getAllUsers().subscribe(users => {
        this.user = users.find(u => u.uid === this.currentUserId) as User;
        if (this.user) {
          this.config.updateHeaderSettings(this.user.displayName, true);
        }
      })
    );
  }

  getFollowing(): void {
    this.subscriptions.push(
      this.userService.getFollowingCount(this.currentUserId).subscribe(count => {
        this.followingCount = count;
      })
    );
  }

  getFollowers(): void {
    this.subscriptions.push(
      this.userService.getFollowersCount(this.currentUserId).subscribe(count => {
        this.followersCount = count;
      })
    );
  }

  toggleFollow(): void {
    if (!this.auth.isLoggedIn) {
      this.modalService.isLoginModelOpen = true;
      return;
    }
    if (this.isFollowed) {
      this.userService.unfollowUser(this.auth.loggedInUserId, this.currentUserId).then(() => {
        this.isFollowed = false;
      });
    } else {
      this.userService.followUser(this.auth.loggedInUserId, this.currentUserId).then(() => {
        this.isFollowed = true;
      });
    }
  }

  edit() {
    this.modalService.isEditModalOpen = true;
  }
}
