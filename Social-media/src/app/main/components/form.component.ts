import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ModelService } from '../shared/services/model.service';
import { PostsService } from '../shared/services/posts.service';
import { Comment, Post } from '../interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  template: `
    <!-- Guest User -->
    <div class="border-b-[1px] border-neutral-800 px-5 py-2">
      <div class="py-8" *ngIf="!auth.loggedInUserId">
        <h1 class="text-white text-2xl text-center mb-4 font-bold">
          Welcome to Twitter
        </h1>
        <div class="flex flex-row items-center justify-center gap-4">
          <app-button
            label="Login"
            (click)="modalService.isLoginModelOpen = true"
          >
          </app-button>
          <app-button
            label="Register"
            [secondary]="true"
            (click)="modalService.isRegisterModelOpen = true"
          >
          </app-button>
        </div>
      </div>
    </div>

    <!-- Logged In User -->
    <div class="flex flex-row gap-4" *ngIf="auth.loggedInUserId">
      <Avatar [userId]="auth.loggedInUserId"> </Avatar>
      <div class="w-full">
        <textarea
          [disabled]="isLoading"
          [(ngModel)]="body"
          #ctrl="ngModel"
          class="disabled:opacity-80 peer resize-none mt-3  w-full bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white"
          [placeholder]="placeholder"
        ></textarea>
        <hr
          class="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition"
        />
        <div class="mt-4 flex flex-row justify-end">
          <div style="display: flex; align-items: center;">
            <button
              (click)="fileInput.click()"
              style="margin-right: 10px; background-color: #007bff; color: white; border: none; padding: 5px 10px; cursor: pointer;"
            >
              Select
            </button>
            <span style="color: #555;  padding: 10px;">{{
              fileName || 'none'
            }}</span>
            <input
              #fileInput
              type="file"
              (change)="onFileSelected($event)"
              style="display: none;"
            />
          </div>
          <app-button
            label="Tweet"
            [disabled]="isLoading || !(body.length || file)"
            (click)="tweet()"
          >
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class FormComponent {
  isLoading: boolean = false;
  body: string = '';
  @Input() placeholder: string = '';
  @Input() isComment: boolean = false;
  @Input() postId: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  documents: Document[] = [];

  fileName: string = '';
  file: File | null = null;

  constructor(
    public auth: AuthService,
    public modalService: ModelService,
    private postService: PostsService,
    private storage: AngularFireStorage
  ) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.file = file;
    } else {
      this.fileName = '';
      this.file = null;
    }
  }

  uploadFile() {
    if (this.file) {
      const filePath = `uploads/${this.file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              console.log('File available at', url);
              this.savePostOrComment(url);
            });
          })
        )
        .subscribe();
    } else {
      this.savePostOrComment();
    }
  }

  savePostOrComment(documentUrl?: string) {
    const body: Post | Comment = {
      body: this.body,
      userId: this.auth.loggedInUserId,
      createdAt: new Date(),
    };

    if (documentUrl) {
      (body as Post).documentUrl = documentUrl;
    }

    if (this.isComment) {
      (body as Comment).postId = this.postId;
      this.postService
        .saveComment(body as Comment)
        .then(() => {
          this.resetForm();
        })
        .catch(() => {
          this.isLoading = false;
        });
    } else {
      this.postService
        .savePost(body as Post)
        .then(() => {
          this.resetForm();
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  }

  tweet(): void {
    if (!(this.body.length || this.file)) {
      console.error('Either body or file must be present to tweet.');
      return;
    }

    this.isLoading = true;
    if (this.file) {
      this.uploadFile();
    } else {
      this.savePostOrComment();
    }
  }

  resetForm() {
    this.isLoading = false;
    this.body = '';
    this.fileName = '';
    this.file = null;
  }
}
