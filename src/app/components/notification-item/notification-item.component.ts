import {Component, Input, OnInit} from '@angular/core';
import {NotificationType} from '../../shared/enums/notificationType';
import {NotificationsService} from '../../services/notifications.service';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {
  @Input() notification: any;
  public NotificationType: typeof NotificationType = NotificationType;

  constructor(private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.notification.date = new Date().toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
  }

  /**
   * Mark notification as read function
   */
  public markAsRead(notification) {
    if (!notification.isRead && notification.type !== NotificationType.Bonus) {
      notification.isRead = !notification.isRead;
      const currentCounter = this.notificationService.getNotificationCounter();
      this.notificationService.updateNotificationCounter(currentCounter - 1);
    }
  }
}
