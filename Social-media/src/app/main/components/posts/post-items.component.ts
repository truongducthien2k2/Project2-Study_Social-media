import { Component, Input } from '@angular/core';
import { Post } from '../../interface';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { PostsService } from '../../shared/services/posts.service';

@Component({
  selector: 'app-post-items',
  template: `
    <div
  (click)="goToPost(post.postId)"
  class="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition"
>
  <div class="flex flex-row items-start gap-3 " >
    <Avatar></Avatar>
    <div>
      <div class="flex flex-row items-center gap-2">
        <p class="text-white font-semibold cursor-pointer hover:underline">
          {{ post.user?.displayName }}
        </p>
        <span
          (click)="goToUser(post.user?.uid)"
          class="text-neutral-500 cursor-pointer hover:underline hidden md:block"
        >
          @{{ post.user?.username }}
        </span>
        <span class="text-neutral-500 text-sm">
          {{ post.createdAt?.toDate() | dateAgo }}
        </span>
      </div>
      <div class="text-white mt-1">
        {{ post.body }}
      </div>

      
<!-- Hiển thị các tag -->
<div class="text-blue-500 mt-1">
  <ng-container *ngFor="let tag of post.tags; let last = last">
    <span class="cursor-pointer hover:underline">#{{ tag }}</span>
    <span>&nbsp;</span>
  </ng-container>
</div>

      <!-- Display the documents below the post body -->
      <div class="mt-3">
        <ng-container *ngFor="let url of post.documentUrls">
          <div *ngIf="isImage(url)" class="mt-2">
            <img [src]="url" alt="Document Image" class="max-w-full h-auto" />
          </div>
          <div *ngIf="isPdf(url)" class="mt-2">
            <a [href]="url" target="_blank" class="text-blue-500 hover:underline">View PDF</a>
          </div>
          <!-- Add more conditions for other document types if needed -->
          <div *ngIf="!isImage(url) && !isPdf(url)" class="mt-2">
            <a [href]="url" target="_blank" class="text-blue-500 hover:underline">View Document</a>
          </div>
        </ng-container>
      </div>
      <div class="flex flex-row items-center mt-3 gap-10">
        <div
          class="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500"
        >
          <span class="text-white material-icons"> mode_comment </span>
          <p class="text-white">
            {{ post.commentCount }}
          </p>
        </div>
        <div
          (click)="toggleLike($event)"
          class="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500"
        >
          <span class="text-white material-icons">
            {{
              post.likes?.length &&
              post.likes?.includes(this.auth.loggedInUserId)
                ? 'favorite'
                : 'favorite_border'
            }}
          </span>
          <p class="text-white">
            {{ post.likes?.length ?? '0' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [],
})
export class PostItemsComponent {
  @Input() post!: Post;

  constructor(
    public auth: AuthService,
    private router: Router,
    private postService: PostsService
  ) {}

  goToUser(id: string | undefined): void {
    this.router.navigate(['user', id]);
  }

  toggleLike(event: Event): void {
    event.stopPropagation();
    if (this.post.postId) {
      this.postService
        .toggleLike(this.post.postId, this.auth.loggedInUserId)
        .subscribe();
    }
  }

  goToPost(id: string | undefined): void {
    this.router.navigate(['post', id]);
  }
  isImage(url: string): boolean {
    try {
      const fileExtension = new URL(url).pathname.split('.').pop()?.toLowerCase();
      return ['jpeg', 'jpg', 'gif', 'png','webp'].includes(fileExtension || '');
    } catch (error) {
      console.error('Invalid URL:', url);
      return false;
    }
  }
  
  isPdf(url: string): boolean {
    try {
      const fileExtension = new URL(url).pathname.split('.').pop()?.toLowerCase();
      return ['pdf', 'doc'].includes(fileExtension || '');
    } catch (error) {
      console.error('Invalid URL:', url);
      return false;
    }
  }
}
