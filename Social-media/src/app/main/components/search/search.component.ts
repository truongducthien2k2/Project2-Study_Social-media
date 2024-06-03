import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  tag: string | null = null;
  searchQuery: string = '';

  constructor(private postService: PostsService, private route: ActivatedRoute,private config: ConfigService) {}

  ngOnInit(): void {
    this.config.updateHeaderSettings('Search')
    this.route.paramMap.subscribe(params => {
      this.tag = params.get('tag');
      this.fetchPosts();
    });
  }

  fetchPosts(): void {
    if (this.tag) {
      this.postService.getPostsByTags([this.tag]).subscribe((posts) => {
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
    if (this.searchQuery) {
      this.filteredPosts = this.posts.filter(post => 
        post.body.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    } else {
      this.filteredPosts = this.posts;
    }
  }
}
