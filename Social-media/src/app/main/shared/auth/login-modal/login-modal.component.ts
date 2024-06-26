import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModelService } from '../../services/model.service';
import { AuthService } from '../../services/auth.service';
import { filter, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, public modalService: ModelService, private authService: AuthService
    ,private router: Router, private route: ActivatedRoute
  ) { 

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
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
      'focus:border-red-500': this.loginForm.get(fieldName)?.invalid && this.loginForm.get(fieldName)?.touched,
      'focus:border-2': true,
      'transition': true,
      'disabled:bg-neutral-900': true,
      'disabled:opacity-70': true,
      'disabled:cursor-not-allowed': true
    }
  }

  signUp(): void {
    this.modalService.isLoginModelOpen = false;
    this.modalService.isRegisterModelOpen = true;
  }

 handleSubmit(): void {
  const value = this.loginForm.value;
  this.authService.login(value.email, value.password).then(async () => {
    // Wait until the user data is updated in AuthService
    await this.authService.userData.pipe(
      filter(user => !!user),
      take(1)
    ).subscribe(() => {
      this.modalService.isLoginModelOpen = false;
    });
  });
  this.router.navigate(['/']);
}
}