import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../interface';
import { PostsService } from '../../shared/services/posts.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, forkJoin } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { CommentService } from '../../shared/services/comment.service';

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
              <span 
                class="text-white text-sm "
                (click)="toggleEditMode(comment.id!)"
              > Chỉnh sửa </span>
            </ng-container>
          </div>
          <div class="text-white mt-1">
            {{ comment.body }}
          </div>

          <div class="mt-3" *ngIf="!isEditing">
              <ng-container *ngFor="let url of comment.documentUrls">
                <div *ngIf="isImage(url)" class="mt-2">
                  <img
                    [src]="url"
                    alt="Comment Image"
                    class="max-w-full h-auto"
                  />
                </div>
                <div *ngIf="isPdf(url)" class="mt-2">
                  <a
                    [href]="url"
                    target="_blank"
                    class="text-blue-500 hover:underline"
                    >View PDF</a
                  >
                </div>
                <!-- Add more conditions for other document types if needed -->
                <div *ngIf="!isImage(url) && !isPdf(url)" class="mt-2">
                  <a
                    [href]="url"
                    target="_blank"
                    class="text-blue-500 hover:underline"
                    >View Document</a
                  >
                </div>
              </ng-container>
            </div>

            <div class="mt-1" *ngIf="isEditing">
              <div
                contenteditable="true"
                class="editable-content"
                style="background-color: #ffffff; border: 1px solid #cccccc; padding: 5px; min-height: 50px;"
                (input)="onEdit($event)"
              >
                {{ editableBody }}
              </div>
              <div style="display: flex; align-items: center;">
                <app-button
                  (click)="fileInput.click()"
                  label="Select documents"
                ></app-button>
                <span style="color: #555; padding: 10px;">{{
                  fileNames.length > 0 ? fileNames.join(', ') : ''
                }}</span>
                <input
                  class="text-white"
                  #fileInput
                  type="file"
                  (change)="onFilesSelected($event)"
                  style="display: none;"
                  class="mt-2"
                  multiple
                />
              </div>
              <ng-container *ngFor="let url of editableDocumentArray">
                <div *ngIf="isImage(url)" class="mt-2">
                  <span
                    (click)="removeDoc(url)"
                    class="cursor-pointer text-red-500 ml-2"
                    >Remove image</span
                  >
                  <img
                    [src]="url"
                    alt="Document Image"
                    class="max-w-full h-auto"
                  />
                </div>
                <div *ngIf="isPdf(url)" class="mt-2">
                  <a
                    [href]="url"
                    target="_blank"
                    class="text-blue-500 hover:underline"
                    >View PDF</a
                  >
                  <span
                    (click)="removeDoc(url)"
                    class="cursor-pointer text-red-500 ml-2"
                    >X</span
                  >
                </div>
                <!-- Add more conditions for other document types if needed -->
                <div *ngIf="!isImage(url) && !isPdf(url)" class="mt-2">
                  <a
                    [href]="url"
                    target="_blank"
                    class="text-blue-500 hover:underline"
                    >View Document</a
                  >
                  <span
                    (click)="removeDoc(url)"
                    class="cursor-pointer text-red-500 ml-2"
                    >X</span
                  >
                </div>
              </ng-container>

              <div class="flex justify-end mt-2">
                <app-button
                  (click)="saveEdit()"
                  (click)="toggleOptions()"
                  label="Save"
                  class="text-white "
                >
                  ></app-button
                >
                <app-button
                  label="Cancel"
                  (click)="cancelEdit()"
                  (click)="toggleOptions()"
                  class=" text-white"
                >
                </app-button>
              </div>
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
  comment!: Comment;
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
    private storage: AngularFireStorage,
    private commentService: CommentService) {}

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

  toggleEditMode(commentId: string): void {
    this.comment = this.getCommentbyCommentId(commentId);
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editableBody = this.comment.body;
      this.editableDocumentArray = this.comment.documentUrls
        ? [...this.comment.documentUrls]
        : [];
      console.log(this.editableDocumentArray);
    }
  }

  getCommentbyCommentId(commentId: string): Comment {
    const c = this.comments.find(x => x.id = commentId)!;
    return c;
  }

  onEdit(event: Event): void {
    const target = event.target as HTMLElement;
    const cursorPosition = this.getCaretPosition(target);
    this.editableBody = target.innerText;
    setTimeout(() => {
      this.setCaretPosition(target, cursorPosition);
    }, 0);
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    if (this.comment.postId && this.editableBody.trim() !== '') {
      

      // Set the post's documentUrls to the editableDocumentArray
      this.comment.documentUrls = [...this.editableDocumentArray];

      if (this.selectedFiles.length > 0) {
        this.files = this.selectedFiles;
        this.uploadFiles().subscribe((uploadedUrls: string[]) => {
          this.comment.documentUrls!.push(...uploadedUrls);
          this.updateCommentContent();
        });
      } else {
        this.updateCommentContent();
      }
    }
  }

  updateCommentContent(): void {
    console.log(this.editableBody);
    this.commentService
      .updateComment(this.comment.id!, {
        body: this.editableBody,
        documentUrls: this.comment.documentUrls,
      })
      .then(() => {
        this.comment.body = this.editableBody;
        this.comment.documentUrls = this.editableDocumentArray;
        this.isEditing = false;
        this.selectedFiles = [];
      })
      .catch((error: any) => console.error('Error updating post:', error));
  }

  getCaretPosition(element: HTMLElement): number {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(element);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      return preSelectionRange.toString().length;
    }
    return 0;
  }

  setCaretPosition(element: HTMLElement, position: number): void {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(element.childNodes[0], position);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);
    element.focus();
  }

  isImage(url: string): boolean {
    try {
      const fileExtension = new URL(url).pathname
        .split('.')
        .pop()
        ?.toLowerCase();
      return ['jpeg', 'jpg', 'gif', 'png', 'webp'].includes(
        fileExtension || ''
      );
    } catch (error) {
      console.error('Invalid URL:', url);
      return false;
    }
  }

  isPdf(url: string): boolean {
    try {
      const fileExtension = new URL(url).pathname
        .split('.')
        .pop()
        ?.toLowerCase();
      return ['pdf', 'doc'].includes(fileExtension || '');
    } catch (error) {
      console.error('Invalid URL:', url);
      return false;
    }
  }
}
