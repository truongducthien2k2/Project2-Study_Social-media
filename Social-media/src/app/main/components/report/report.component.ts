import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../interface';
import { UserService } from '../../shared/services/user.service';
import { ModelService } from '../../shared/services/model.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../shared/services/config.service';
import { ReportService } from '../../shared/services/report.service'; // Add this import
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
  reportForm!: FormGroup; // Change to reportForm
  @Input() rpuserIDs: string = ''; 
  currentUserId: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    public modalService: ModelService,
    private fb: FormBuilder,
    public userService: UserService,
    private storage: AngularFireStorage,
    private reportService: ReportService,
    private auth: AuthService // Inject ReportService
  ) {
    this.reportForm = this.fb.group({
      message: ['', Validators.required], // Add message field
    });
  }

  ngOnInit(): void {
    console.log(1, this.rpuserIDs)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  submitReport(): void {
    const message = this.reportForm.value.message;
    this.reportService.createUserReport(this.rpuserIDs,this.auth.loggedInUserId , message)
      .then(() => {
        console.log('Report submitted successfully');
        this.modalService.isReportModalOpen = false; 
      })
      .catch(error => {
        console.error('Error submitting report:', error);
      });
  }

  getInputClasses(fieldName: string, followId: string): any {
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
      'focus:border-2': true,
      transition: true,
      'disabled:bg-neutral-900': true,
      'disabled:opacity-70': true,
      'disabled:cursor-not-allowed': true,
    };
  }
}
