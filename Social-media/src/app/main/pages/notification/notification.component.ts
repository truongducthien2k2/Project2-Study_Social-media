import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthService } from '../../shared/services/auth.service';
import { Notification } from '../../interface';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  notificationIds: Set<string> = new Set();

  constructor(private notificationService: NotificationService, private authService: AuthService, private config: ConfigService) { }

  ngOnInit() {
    this.config.updateHeaderSettings('Notification')
    const userId = this.authService.loggedInUserId;
    this.notificationService.getAllNotifications().subscribe(notifications => {
      notifications.forEach(notification => {
        if (notification.userIdTo === userId && !this.notificationIds.has(notification.id)) {
          this.notifications.push(notification);
          this.notificationIds.add(notification.id); 
        }
      });
    });
  }

  markAsSeen(notificationId: string) {
    this.notificationService.markAsSeen(notificationId);
  }
}
