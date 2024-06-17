import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../shared/services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
@Component({
  selector: 'app-post',
  template: `
   <div class="flex justify-center align-middle " *ngIf="loading">
      <loader></loader>
    </div>
    <app-post-items *ngIf="post" [post]="post"></app-post-items>
    <app-form 
      placeholder="Write a comment" 
      [postId]="post?.postId" 
      [isComment]="true"
      (uploadClicked)="handleUploadClick()"
    ></app-form>
    <app-comments *ngIf="post" [postId]="post.postId"></app-comments>
  `,
  styles: [
  ]
})
export class PostComponent implements OnInit {
  post!: any;
  loading: boolean = true;

  constructor(private postService: PostsService, private activatedRoute: ActivatedRoute, private config: ConfigService
    ,private auth: AuthService, private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.config.updateHeaderSettings('Post', true);
    const postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.fetchPost(postId);

  }

  fetchPost(postId: string | null): void {
    if (postId) {
      this.postService.getPost(postId).subscribe(post => {
        this.post = post;
        this.loading = false;
      });
    }
  }

  handleUploadClick(): void {
    if(this.post.userId != this.post.postId){
    this.notification.createCommentNotification(this.post.postId,this.post.userId,this.auth.loggedInUserId)
    }
  }
}
