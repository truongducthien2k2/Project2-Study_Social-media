import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../interface';
import { PostsService } from '../../shared/services/posts.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-comments',
  template: `
    <div
      class="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition"
      *ngFor="let comment of comments"
    >
      <div class="flex flex-row items-start gap-3">
        <Avatar
          [photoURL]="comment.user?.photoURL ?? '/assets/images/user.png'"
        ></Avatar>
        <div>
          <div class="flex flex-row items-center gap-2">
            <p class="text-white font-semibold cursor-pointer hover:underline">
              {{ comment.user?.displayName }}
            </p>
            <span
              class="text-white cursor-pointer hover:underline hidden md:block"
            >
              @{{ comment.user?.username }}
            </span>
            <span class="text-white text-sm">
              {{ comment.createdAt?.toDate() | dateAgo }}
            </span>
            <ng-container
              *ngIf="comment.user?.uid === auth.loggedInUserId.toString()"
            >
              <span
                class="text-white text-sm "
                (click)="deleteComment(comment.id!)"
              >
                Xóa
              </span>
              <span class="text-white text-sm "> Chỉnh sửa </span>
            </ng-container>
          </div>
          <div class="text-white mt-1">
            {{ comment.body }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  @Input() postId: string = '';

  constructor(private postService: PostsService, public auth: AuthService) {}

  ngOnInit(): void {
    this.postService.getCommentsByPostId(this.postId).subscribe((comments) => {
      this.comments = comments;
    });
  }

  deleteComment(commentId: string): void {
    this.postService
      .deleteComment(commentId)
      .then(() => {
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
      })
      .catch((error) => console.error('Error deleting comment:', error));
  }
}
