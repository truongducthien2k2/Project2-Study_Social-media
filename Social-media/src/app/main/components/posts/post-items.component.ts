import { Component, Input } from '@angular/core';
import { Post } from '../../interface';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { PostsService } from '../../shared/service/posts.service';

@Component({
  selector: 'app-post-items',
  template: `
    <div (click)="goToPost(post.postId)" class="border-b-[1px] border-neutral-800 p-5 cursor-pointer hover:bg-neutral-900 transition">
      <div class="flex flex-row items-start gap-3">
        <Avatar></Avatar>
        <div>
          <div class="flex flex-row items-center gap-2">
            <p class="text-white font-semibold cursor-pointer hover:underline">
              {{post.user?.displayName}}
            </p>
            <span (click)="goToUser(post.user?.uid)" class="text-neutral-500 cursor-pointer hover:underline hidden md:block">
              @{{post.user?.username}}
            </span>
            <span class="text-neutral-500 text-sm">
              {{post.createdAt?.toDate()}}
            </span>
        </div>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class PostItemsComponent {
  @Input() post!: Post;

  constructor(public auth: AuthService, private router: Router, private postService: PostsService) { }

  goToUser(id: string | undefined): void {
    this.router.navigate(['user', id])
  }

  goToPost(id: string | undefined): void {
    this.router.navigate(['post', id]);
  }
}