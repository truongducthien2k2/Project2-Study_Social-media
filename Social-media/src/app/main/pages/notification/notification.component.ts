import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthService } from '../../shared/services/auth.service';
import { Notification, User } from '../../interface';
import { ConfigService } from '../../shared/services/config.service';
import { UserService } from '../../shared/services/user.service';
import { ModalComponent } from '../../components/small-components/modal.component';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  users: { [key: string]: User } = {};
  notificationIds: Set<string> = new Set();
  activeTab: string = 'all';
  constructor(private user: UserService, private router: Router,
    private notificationService: NotificationService, private authService: AuthService, private config: ConfigService) { }

  ngOnInit() {
    this.config.updateHeaderSettings('Notification');
    const userId = this.authService.loggedInUserId;
    this.notificationService.getAllNotifications().subscribe(notifications => {
      notifications.forEach(notification => {
        if (notification.userIdTo === userId && !this.notificationIds.has(notification.id)) {
          this.notifications.push(notification);
          this.notificationIds.add(notification.id);
          this.user.getUser(notification.userIdFrom).subscribe(user => {
            if (user) {
              this.users[notification.userIdFrom] = user; 
            }
          });
        }
      });
    });
  }
  gohome(){
    this.router.navigate(['/']);
  }
  gotouser(id: string,notificationId: string) {
    this.notificationService.markAsSeen(notificationId);
    this.router.navigate([`/user/${id}`]);
  }
  gotopost(id: string, notificationId: string) {
    if (id !== "") {
      this.notificationService.markAsSeen(notificationId);
      this.router.navigate([`/post/${id}`]);
    }
  }
  markAsSeen(notificationId: string) {
    this.notificationService.markAsSeen(notificationId);
  }
  async deleteNotification(id: string){
    await this.notificationService.deleteNotification(id);
    window.location.reload();
  }
}
