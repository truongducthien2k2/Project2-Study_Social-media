import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { Post } from '../../interface';
import { PostsService } from '../../shared/services/posts.service';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})
export class FavouriteComponent implements OnInit, OnDestroy {
  favouritePosts: Post[] = [];
  private subscription!: Subscription;

  constructor(
    public auth: AuthService,
    private postsService: PostsService,
    private config: ConfigService
  ) {}

  ngOnInit(): void {
    this.config.updateHeaderSettings('Your Like Post');
    if (this.auth.loggedInUserId) {
      this.postsService.getPostsByLikedUserId(this.auth.loggedInUserId).subscribe(posts => {
        this.favouritePosts= posts
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
