import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../../interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PostsService } from '../../shared/services/posts.service';

@Component({
  selector: 'app-posts',
  template: `
    <div class="flex justify-center align-middle" *ngIf="loading">
      <loader></loader>
    </div>
    <ng-container *ngFor="let post of posts">
      <app-post-items *ngIf="post" [post]="post"> </app-post-items>
    </ng-container>
  `,
  styles: [],
})
export class PostsComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  posts: Post[] = [];
  subscription!: Subscription;
  userId: string = '';
  categoryId!: string;
  constructor(
    private postService: PostsService,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.activatedRoute.snapshot.paramMap.get('categoryid');
    if (id) {
      this.categoryId = id;
    } else {
    }
    this.subscription = await this.activatedRoute.paramMap?.subscribe(
      (params: ParamMap) => {
        this.userId = params.get('id') || '';
        this.loading = true;
        this.getPosts();
      }
    );
  }

  private async getPosts(): Promise<void> {
    this.posts = [];
    if (this.categoryId != null){
      this.subscription = await this.postService.getPostsByType(this.categoryId).subscribe(
        (posts) => {
          this.posts = posts;
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    }
    else {
      this.subscription = await this.postService.getPostsbyday(this.categoryId).subscribe(
        (posts) => {
          this.posts = posts;
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
