import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interface';
import { UserService } from '../../shared/services/user.service';
import { ModelService } from '../../shared/services/model.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  editProfile!: FormGroup;
  @Input() user!: User;
  selectedFile: File | null = null;

  constructor(
    public modalService: ModelService,
    private fb: FormBuilder,
    private userService: UserService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.editProfile = this.fb.group({
      displayName: [this.user.displayName, Validators.required],
      username: [this.user.username, Validators.required],
      bio: [this.user.bio],
      photoURL: [this.user.photoURL]
    });
  }

  getInputClasses(fieldName: string) {
    return {
      'w-full': true,
      'p-4': true,
      'text-lg': true,
      'bg-black': true,
      'border-2': true,
      'border-neutral-800': true,
      'rounded-md': true,
      'outline-none': true,
      'text-white': true,
      'focus:border-sky-500': true,
      'focus:border-red-500': this.editProfile.get(fieldName)?.invalid && this.editProfile.get(fieldName)?.touched,
      'focus:border-2': true,
      'transition': true,
      'disabled:bg-neutral-900': true,
      'disabled:opacity-70': true,
      'disabled:cursor-not-allowed': true
    };
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.editProfile.patchValue({ photoURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `profile_pictures/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(
            (url) => {
              resolve(url);
            },
            (error) => {
              reject(error);
            }
          );
        })
      ).subscribe();
    });
  }

  async submit() {
    try {
      let photoURL = this.user.photoURL;

      if (this.selectedFile) {
        photoURL = await this.uploadFile(this.selectedFile);
      }

      const data = { ...this.editProfile.value, photoURL };
      await this.userService.editUserProfile(this.user.uid, data);
      this.modalService.isEditModalOpen = false;
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
}
