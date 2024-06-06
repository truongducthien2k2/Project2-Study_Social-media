import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interface';
import { UserService } from '../../shared/services/user.service';
import { ModelService } from '../../shared/services/model.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-follow-user',
  templateUrl: './follow-user.component.html',
  styleUrls: ['./follow-user.component.scss'],
})
export class FollowUserComponent implements OnInit, OnDestroy {
  editProfile!: FormGroup;
  @Input() followersUserIds: string[] = [];
  @Input() followingUserIds: string[] = [];
  currentUserId: string = '';
  private subscriptions: Subscription[] = [];
  followers: User[] = [];
  followings: User[] = [];
  constructor(
    public modalService: ModelService,
    private fb: FormBuilder,
    public userService: UserService,
    private storage: AngularFireStorage
  ) {
    this.editProfile = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('1', this.modalService.followModalType);
    this.loadFollowers();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadFollowers(): void {
    const userIds = this.modalService.followModalType === 'followers' ? this.followersUserIds : this.followingUserIds;
    const uniqueUids = new Set<string>();
  
    userIds.forEach((userId) => {
      const sub = this.userService.getUser(userId).subscribe((user) => {
        if (user && !uniqueUids.has(user.uid)) {
          this.followers.push(user);
          uniqueUids.add(user.uid);
        }
      });
      this.subscriptions.push(sub);
    });
  }
  

  // Hàm để trả về các classes CSS dựa trên trạng thái của người dùng
  getInputClasses(fieldName: string, followId: string): any {
    const isFollowing = this.followersUserIds.includes(followId);
    return {
      'w-full': true,
      'p-4': true,
      'text-lg': true,
      'bg-black': true,
      'border-2': true,
      'border-neutral-800': true,
      'rounded-md': true,
      'outline-none': true,
      'text-white': true,
      'focus:border-sky-500': true,
      'focus:border-red-500':
        isFollowing &&
        this.editProfile.get(fieldName)?.invalid &&
        this.editProfile.get(fieldName)?.touched,
      'focus:border-2': true,
      transition: true,
      'disabled:bg-neutral-900': true,
      'disabled:opacity-70': true,
      'disabled:cursor-not-allowed': true,
    };
  }
}
