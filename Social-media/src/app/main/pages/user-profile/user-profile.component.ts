import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../interface';
import { Subscription } from 'rxjs';
import { ModelService } from '../../shared/services/model.service';
import { ConfigService } from '../../shared/services/config.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';

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
  public currentUserId: string = '';
  loading: boolean = false;
  isAdmin: boolean = false;
  adminrole: boolean = false;
  isBan: boolean = false;
  @Input() followersUserIds: string[] = [];
  @Input() followingUserIds: string[] = [];
  @Input() userID: string = '';
  @Input() rpuserIDs: string = ''; // Add rpuserIDs input
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private config: ConfigService,
    public auth: AuthService,
    public modalService: ModelService,
    private router: Router,
    public notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
        this.currentUserId = params.get('id') || '';
        this.isAdmin = this.currentUserId === this.auth.loggedInUserId;
        const loggedUser = this.userService.getUser(this.auth.loggedInUserId).subscribe((user) => {
          if (user) {
            // Initialize the parameter with the user data
            const userParam: User = user;
            this.adminrole = (user.role == "admin");
          } else {
            console.error('User not found');
          }
        });
        const currentUser = this.userService.getUser(this.currentUserId).subscribe((user) => {
          if (user) {
            // Initialize the parameter with the user data
            const userParam: User = user;
            this.isBan = user.isBan;
          } else {
            console.error('User not found');
          }
        });
        this.getCurrentUserProfileInfo();
        this.getFollowers();
        this.getFollowing();
        this.getFollowersUserIds();
        this.getFollowingUserIds();
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

  reportUser(): void {
    this.rpuserIDs = this.user.uid
    this.modalService.isReportModalOpen = true;
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
    this.notification.createfollowNotification('',this.currentUserId,this.auth.loggedInUserId)
  }

  getFollowersUserIds(): void {
    this.subscriptions.push(
      this.userService.getFollowersUserIds(this.currentUserId).subscribe(userIds => {
        this.followersUserIds = userIds;
      })
    );
  }

  getFollowingUserIds(): void {
    this.subscriptions.push(
      this.userService.getFollowingUserIds(this.currentUserId).subscribe(userIds => {
        this.followingUserIds = userIds;
      })
    );
  }

  goToFollowing() {
    if (this.followingUserIds.length > 0) {
      this.router.navigate(['/user', this.currentUserId, 'following'], { queryParams: { followingUserIds: this.followingUserIds.join(',') } });
    }
  }

  goToFollowers() {
    if (this.followersUserIds.length > 0) {
      this.router.navigate(['/user', this.currentUserId, 'followers'], { queryParams: { followersUserIds: this.followersUserIds.join(',') } });
    }
  }

  edit() {
    this.modalService.isEditModalOpen = true;
  }

  follow(type: 'followers' | 'followings'): void {
    this.modalService.followModalType = type;
    this.modalService.isFollowModalOpen = true;
  }

  async ban() {
   await this.userService.updatebanUser(this.currentUserId, true).catch();
  }

  async unBan() {
    await this.userService.updatebanUser(this.currentUserId, false).catch();
   }
}
