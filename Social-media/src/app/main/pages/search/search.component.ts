import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../interface';
import { PostsService } from '../../shared/services/posts.service';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  tags: string[] = [];
  searchQuery: string = '';

  constructor(
    private postService: PostsService, 
    private route: ActivatedRoute,
    private config: ConfigService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.config.updateHeaderSettings('Search');
    this.route.paramMap.subscribe(params => {
      const tagParam = params.get('tag');
      this.tags = tagParam ? tagParam.split(',') : [];
      this.fetchPosts();
    });
  }

  fetchPosts(): void {
    if (this.tags.length > 0) {
      this.postService.getPostsByTags(this.tags).subscribe((posts) => {
        this.posts = posts;
        this.filteredPosts = posts;
      });
    } else {
      this.postService.getPosts().subscribe((posts) => {
        this.posts = posts;
        this.filteredPosts = posts;
      });
    }
  }

  onSearchChange(): void {
    const queryTags = this.searchQuery.split(' ').map(tag => tag.trim().toLowerCase());
    if (queryTags.every(tag => tag.startsWith('#'))) {
      const strippedTags = queryTags.map(tag => tag.substring(1));
      this.filteredPosts = this.posts.filter(post => 
        strippedTags.every(queryTag => post.tags?.some(tag => tag.toLowerCase().includes(queryTag)))
      );
    } else {
      this.filteredPosts = this.posts.filter(post => 
        post.body.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  onEnterPress(): void {
    if (this.searchQuery.split(' ').every(tag => tag.startsWith('#'))) {
      const queryTags = this.searchQuery.split(' ').map(tag => tag.trim().substring(1));
      this.gotoSearch(queryTags.join(','));
    } else {
      this.gotoSearch1();
    }
  }

  gotoSearch(tags: string): void {
    this.router.navigate(['search', { tag: tags }]);
  }

  gotoSearch1(): void {
    this.router.navigate(['search']);
  }

  clearTags(): void {
    this.tags = [];
    this.fetchPosts();
  }
}
