import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../interface';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { PostsService } from '../../shared/services/posts.service';
import { Observable, forkJoin } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { NotificationService } from '../../shared/services/notification.service';
import { Notification } from '../../interface';
import { ReportService } from '../../shared/services/report.service';
import { ModelService } from '../../shared/services/model.service';
@Component({
  selector: 'app-post-items',
  template: `
    <div
      class="border-0 border-neutral-600 p-5 cursor-pointer hover:bg-neutral-900 transition"
    >
      <div class="flex flex-row items-start gap-3">
        <Avatar
          [photoURL]="post.user?.photoURL ?? '/assets/images/user.png'"
        ></Avatar>
        <div>
          <div class="flex flex-row items-center gap-2">
            <p class="text-white font-semibold cursor-pointer hover:underline">
              {{ post.user?.displayName }}
            </p>
            <span
              (click)="goToUser(post.user?.uid)"
              class="text-white cursor-pointer hover:underline hidden md:block"
            >
              @{{ post.user?.username }}
            </span>
            <span class="text-white text-sm ">
              {{ post.createdAt?.toDate() | dateAgo }}
            </span>
            <!-- Edit and Delete Buttons -->

            <span
              (click)="toggleOptions()"
              class="material-icons cursor-pointer text-white"
            >
              more_vert
            </span>
            <ng-container
              *ngIf="
                showOptions && post.user?.uid === auth.loggedInUserId.toString()
              "
            >
              <div class="options">
                <span
                  class="material-icons text-blue-500 text-sm cursor-pointer hover:underline"
                  style="margin-right: 15px; margin-left: 3px;"
                  (click)="toggleEditMode()"
                >
                  <strong>edit</strong>
                </span>
                <span
                  class="material-icons text-red-500 text-sm cursor-pointer hover:underline"
                  (click)="deletePost(post.postId!)"
                >
                  <strong>delete</strong>
                </span>
              </div>
            </ng-container>
            <ng-container
              *ngIf="
                showOptions && post.user?.uid !== auth.loggedInUserId.toString()
              "
            >
              <div class="options">
                <span
                  class="material-icons text-blue-500 text-sm cursor-pointer hover:underline"
                  style="margin-right: 15px; margin-left: 3px;"
                  (click)="reportPost(post.postId!, auth.loggedInUserId.toString())"
                >
                  <strong>report</strong>
                </span>
              </div>
            </ng-container>
          </div>
          <div
            *ngIf="!isEditing"
            class="text-white mt-1"
            (click)="goToPost(post.postId)"
          >
            {{ post.body }}
          </div>

          <!-- Chỉnh sửa -->
          <div *ngIf="isEditing" class="mt-1">
            <div
              contenteditable="true"
              class="editable-content "
              style="background-color: #ffffff; padding: 5px; min-height: 50px;"
              (input)="onEdit($event)"
            >
              {{ editableBody }}
            </div>
            <input
              type="text"
              [(ngModel)]="newTag"
              (keydown.enter)="addTag()"
              class="mt-2 w-full px-3 py-1 border border-0 border-neutral-600 rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Add new tag"
            />
            <ng-container
              *ngFor="let tag of editableTagsArray; let last = last"
            >
              <!-- Kiểm tra nếu tag không phải là null thì mới hiển thị -->
              <ng-container *ngIf="tag !== null && tag != ''">
                <div class="tag">
                  <span
                    contenteditable="true"
                    class="cursor-pointer hover:underline text-white"
                    >#{{ tag }}</span
                  >
                  <!-- Hiển thị nút xóa tag -->
                  <span
                    (click)="removeTag(tag)"
                    class="cursor-pointer text-red-500"
                    >X</span
                  >
                </div>
              </ng-container>
              <!--Document -->
            </ng-container>

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
          <!-- Hiển thị các tag -->
          <div class="text-blue-500 mt-1" *ngIf="!isEditing">
            <ng-container *ngFor="let tag of post.tags; let last = last">
              <span
                class="cursor-pointer hover:underline"
                (click)="gotoSearch(tag)"
                >#{{ tag }}</span
              >
              <span>&nbsp;</span>
            </ng-container>
          </div>
          <!-- Display the documents below the post body -->
          <div class="mt-3" *ngIf="!isEditing">
            <ng-container *ngFor="let url of post.documentUrls">
              <div *ngIf="isImage(url)" class="mt-2">
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
          <div class="flex flex-row items-center mt-3 gap-10">
            <div
              class="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500"
              (click)="goToPost(post.postId)"
            >
              <span class="text-white material-icons"> mode_comment </span>
              <p class="text-white">
                {{ post.commentCount }}
              </p>
            </div>
            <div
              (click)="toggleLike($event)"
              class="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-red-500"
            >
              <span class="text-white material-icons">
                {{
                  post.likes?.length &&
                  post.likes?.includes(this.auth.loggedInUserId)
                    ? 'favorite'
                    : 'favorite_border'
                }}
              </span>
              <p class="text-white">
                {{ post.likes?.length ?? '0' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-report
    *ngIf="this.modalService.isReportModalOpen">
    </app-report>
  `,
  styles: [],
})
export class PostItemsComponent implements OnInit {
  @Input() post!: Post;
  posts: Post[] = [];
  isEditing: boolean = false;
  editableBody: string = '';
  editableTags: string = '';
  editableTagsArray: string[] = [];
  editableDocumentArray: string[] = [];
  selectedFiles: File[] = [];
  newTag: string = '';
  fileNames: string[] = [];
  files: File[] = [];
  showOptions: boolean = false;
  constructor(
    public auth: AuthService,
    private router: Router,
    private postService: PostsService,
    private storage: AngularFireStorage,
    private notificationService: NotificationService,
    private reportService: ReportService,
    public modalService: ModelService,
  ) {}
  toggleLike(event: Event): void {
    event.stopPropagation();
    if (this.post.postId) {
      this.postService
        .toggleLike(this.post.postId, this.auth.loggedInUserId)
        .subscribe(() => {
          if (this.post.likes?.includes(this.auth.loggedInUserId)) {
            this.notificationService
              .deleteLikeNotification(
                this.post.postId!,
                this.post.userId,
                this.auth.loggedInUserId
              )
              .then(() => {
                console.log('Notification deleted successfully');
              })
              .catch((error) => {
                console.error('Error deleting notification:', error);
              });
          } else {
            this.notificationService
              .createLikeNotification(
                this.post.postId!,
                this.post.userId,
                this.auth.loggedInUserId
              )
              .then(() => {
                console.log('Notification created successfully');
              })
              .catch((error) => {
                console.error('Error creating notification:', error);
              });
          }
        });
    }
  }

  toggleOptions(): void {
    this.showOptions = !this.showOptions;
  }
  ngOnInit(): void {}

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

  saveEdit(): void {
    if (this.post.postId && this.editableBody.trim() !== '') {
      const updatedTags = this.editableTagsArray;
      if (updatedTags.length === 0) {
        this.post.tags = [];
      }

      // Set the post's documentUrls to the editableDocumentArray
      this.post.documentUrls = [...this.editableDocumentArray];

      if (this.selectedFiles.length > 0) {
        this.files = this.selectedFiles;
        this.uploadFiles().subscribe((uploadedUrls: string[]) => {
          this.post.documentUrls!.push(...uploadedUrls);
          this.updatePostContent();
        });
      } else {
        this.updatePostContent();
      }
    }
  }

  updatePostContent(): void {
    this.postService
      .updatePost(this.post.postId!, {
        body: this.editableBody,
        tags: this.editableTagsArray,
        documentUrls: this.post.documentUrls,
      })
      .then(() => {
        this.post.body = this.editableBody;
        this.post.tags = this.editableTagsArray;
        this.post.documentUrls = this.editableDocumentArray;
        this.isEditing = false;
        this.selectedFiles = [];
      })
      .catch((error: any) => console.error('Error updating post:', error));
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

  addTag(): void {
    const trimmedTag = this.newTag.trim();
    if (trimmedTag !== '') {
      if (!Array.isArray(this.editableTagsArray)) {
        this.editableTagsArray = [];
      }
      this.editableTagsArray.push(trimmedTag);
      this.newTag = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.editableTagsArray.indexOf(tag);
    if (index !== -1) {
      this.editableTagsArray.splice(index, 1);
    }
  }
  deletePost(postId: string): void {
    this.postService
      .deletePost(postId)
      .then(() => {
        this.posts = this.posts.filter((post) => post.postId !== postId);
      })
      .catch((error) => console.error('Error deleting post:', error));
  }

  reportPost(postId: string, userIdFrom: string): void {
    this.reportService
      .createPostReport(postId, userIdFrom)
      .then(() => {
        this.posts = this.posts.filter((post) => post.postId !== postId);
      })
      .catch((error) => console.error('Error deleting post:', error));
    this.modalService.isReportModalOpen = true;
  }

  goToUser(id: string | undefined): void {
    this.router.navigate(['user', id]);
  }

  gotoSearch(tag: string): void {
    this.router.navigate(['search', { tag }]);
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editableBody = this.post.body;
      this.editableTags = this.post.tags!.join(' ');
      if (this.editableTags != '') {
        this.editableTagsArray = this.editableTags.split(' ');
      } else this.editableDocumentArray = [];
      this.editableDocumentArray = this.post.documentUrls
        ? [...this.post.documentUrls]
        : [];
      console.log(this.editableDocumentArray);
    }
  }

  onEdit(event: Event): void {
    const target = event.target as HTMLElement;
    const cursorPosition = this.getCaretPosition(target);
    this.editableBody = target.innerText;
    setTimeout(() => {
      this.setCaretPosition(target, cursorPosition);
    }, 0);
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

  cancelEdit(): void {
    this.isEditing = false;
  }

  goToPost(id: string | undefined): void {
    this.router.navigate(['post', id]);
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