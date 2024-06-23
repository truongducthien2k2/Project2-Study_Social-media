import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';
import { User } from '../../interface';

@Injectable({
  providedIn: 'root',
})
export class FacadeService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  // AuthService methods
  login(email: string, password: string) {
    return this.authService.login(email, password);
  }

  register(user: any) {
    return this.authService.register(user);
  }

  logout() {
    return this.authService.signOut();
  }

  // UserService methods
  getUserProfile(userId: string) {
    return this.userService.getUser(userId);
  }

  updateUserProfile(userId: string, data: Partial<User>) {
  }

  // NotificationService methods
  createLikeNotification(postId: string, userIdTo: string, userIdFrom: string) {
    return this.notificationService.createLikeNotification(postId, userIdTo, userIdFrom);
  }

  getAllNotifications() {
    return this.notificationService.getAllNotifications();
  }

  markNotificationAsSeen(notificationId: string) {
    return this.notificationService.markAsSeen(notificationId);
  }
}
