import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../shared/services/posts.service';
import { ConfigService } from '../../shared/services/config.service';
import { AuthService } from '../../shared/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-categoryhome',
  templateUrl: './categoryhome.component.html',
  styleUrls: ['./categoryhome.component.scss']
})
export class CategoryhomeComponent implements OnInit {
  categoryId!: string;

  constructor(
    private postService: PostsService,
    private activatedRoute: ActivatedRoute,
    private config: ConfigService,
    private auth: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('categoryid');
    if (id) {
      this.categoryId = id;
    } else {
      console.error('Category ID is null');
    }
  }
}
