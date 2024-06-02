import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ModelService } from '../shared/services/model.service';
import { PostsService } from '../shared/services/posts.service';
import { Comment, Post } from '../interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, switchMap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  template: `
    <!-- Guest User -->
    <div class="border-b-[1px] border-neutral-800 px-5 py-2">
      <div class="py-8" *ngIf="!auth.loggedInUserId">
        <h1 class="text-white text-2xl text-center mb-4 font-bold">Welcome to Twitter</h1>
        <div class="flex flex-row items-center justify-center gap-4">
          <app-button label="Login" (click)="modalService.isLoginModelOpen = true"> </app-button>
          <app-button label="Register" [secondary]="true" (click)="modalService.isRegisterModelOpen = true"> </app-button>
        </div>
      </div>
    </div>

    <!-- Logged In User -->
    <div class="flex flex-row gap-4" *ngIf="auth.loggedInUserId">
      <Avatar [userId]="auth.loggedInUserId"> </Avatar>
      <div class="w-full">
        <textarea [disabled]="isLoading"
        [(ngModel)]="body"
        #ctrl="ngModel"
          class="disabled:opacity-80 peer resize-none mt-3 w-full bg-black ring-0 outline-none text-[20px] placeholder-neutral-500 text-white"
          [placeholder]="placeholder"></textarea>
        <hr class="opacity-0 peer-focus:opacity-100 h-[1px] w-full border-neutral-800 transition" />
        <div class="mt-4 flex flex-row justify-end">
          <div style="display: flex; align-items: center;">
            <button (click)="fileInput.click()" style="margin-right: 10px; background-color: #007bff; color: white; border: none; padding: 5px 10px; cursor: pointer;">Select</button>
            <span style="color: #555; padding: 10px;">{{ fileNames.length > 0 ? fileNames.join(', ') : 'none' }}</span>
            <input #fileInput type="file" (change)="onFilesSelected($event)" style="display: none;" multiple />
          </div>
          <app-button label="Tweet" [disabled]="isLoading || !(body.length || files.length)" (click)="tweet()"> </app-button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FormComponent {
  isLoading: boolean = false;
  body: string = '';
  @Input() placeholder: string = '';
  @Input() isComment: boolean = false;
  @Input() postId: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  fileNames: string[] = [];
  files: File[] = [];

  constructor(
    public auth: AuthService,
    public modalService: ModelService,
    private postService: PostsService,
    private storage: AngularFireStorage
  ) {}

  onFilesSelected(event: any) {
    const selectedFiles: File[] = Array.from(event.target.files);
    if (selectedFiles.length) {
      this.fileNames = selectedFiles.map(file => file.name);
      this.files = selectedFiles;
    } else {
      this.fileNames = [];
      this.files = [];
    }
  }

  uploadFiles(): Observable<string[]> {
    const uploadObservables = this.files.map(file => {
      const filePath = `uploads/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      return task.snapshotChanges().pipe(
        finalize(() => fileRef.getDownloadURL())
      );
    });

    return forkJoin(uploadObservables).pipe(
      switchMap((tasks: any[]) => {
        const urlObservables = tasks.map((task: any) => {
          const fileRef = this.storage.ref(`uploads/${task.metadata.name}`);
          return fileRef.getDownloadURL();
        });
        return forkJoin(urlObservables);
      })
    );
  }

  savePostOrComment(documentUrls: string[] = []) {
    const body: Post | Comment = {
      body: this.body,
      userId: this.auth.loggedInUserId,
      createdAt: new Date(),
    };

    if (documentUrls.length > 0) {
      (body as Post).documentUrls = documentUrls;
    }

    if (this.isComment) {
      (body as Comment).postId = this.postId;
      this.postService.saveComment(body as Comment).then(() => {
        this.resetForm();
      }).catch(() => {
        this.isLoading = false;
      });
    } else {
      this.postService.savePost(body as Post).then(() => {
        this.resetForm();
      }).catch(() => {
        this.isLoading = false;
      });
    }
  }

  tweet(): void {
    if (!(this.body.length || this.files.length)) {
      console.error('Either body or files must be present to tweet.');
      return;
    }

    this.isLoading = true;
    if (this.files.length > 0) {
      this.uploadFiles().subscribe((urls: string[]) => {
        this.savePostOrComment(urls);
      });
    } else {
      this.savePostOrComment();
    }
  }

  resetForm() {
    this.isLoading = false;
    this.body = '';
    this.fileNames = [];
    this.files = [];
  }
}
