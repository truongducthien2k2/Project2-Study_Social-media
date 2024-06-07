import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../interface';
import { PostsService } from '../../shared/services/posts.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, forkJoin } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';

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
  isEditing: boolean = false;
  editableBody: string = '';
  editableDocumentArray: string[] = [];
  selectedFiles: File[] = [];
  fileNames: string[] = [];
  files: File[] = [];
  showOptions: boolean = false;
  constructor(    public auth: AuthService,
    private router: Router,
    private postService: PostsService,
    private storage: AngularFireStorage) {}

  ngOnInit(): void {
    this.postService.getCommentsByPostId(this.postId).subscribe((comments) => {
      this.comments = comments;
    });
  }
  toggleOptions(): void {
    this.showOptions = !this.showOptions;
  }

  removeDoc(doc: string): void {
    const index = this.editableDocumentArray.indexOf(doc);
    if (index !== -1) {
      this.editableDocumentArray.splice(index, 1);
    }
  }
  uploadFiles(): Observable<string[]> {
    const uploadObservables = this.files.map((file) => {
      const filePath = `uploads/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      return task
        .snapshotChanges()
        .pipe(finalize(() => fileRef.getDownloadURL()));
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



  onFilesSelected(event: any) {
    const selectedFiles: File[] = Array.from(event.target.files);
    if (selectedFiles.length) {
      this.selectedFiles = selectedFiles;
      this.fileNames = selectedFiles.map((file) => file.name);
    } else {
      this.fileNames = [];
      this.selectedFiles = [];
    }
    console.log('1', this.selectedFiles);
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
