import {Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../services/notifications.service';
import {Notification} from '../../models/notification';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public notificationCount = 0;
  public notifications: Notification[] = [];
  public isLoadingNotifications = true;

  constructor(public notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.getNotifications();
  }

  /**
   * Use notifications service to get list of notifications
   * on component initialization function
   */
  private getNotifications() {
    this.notificationsService.fetchAllNotifications().then(function (res) {
      if (res && res.length) {
        this.notifications = res;
        this.isLoadingNotifications = false;
      }
    }.bind(this));
  }

  /**
   * Open notifications list function
   */
  public openNotificationsList() {
    const menuPanel = $('.mat-menu-panel');
    if (menuPanel) {
      menuPanel.css('margin-top', '20px');
      menuPanel.css('border-radius', '5px');
    }
  }

  /**
   * On close notifications list function
   */
  public notificationListMenuClosed() {

  }

  /**
   * Update notifications counter function
   */
  private updateNotificationsCounter() {
    this.notificationCount = this.notificationsService.updateNotificationCounter();
  }

  /**
   * Remove expired notification function
   *
   * @param id
   */
  public removeExpiredNotification(id) {
    this.notificationsService.removeNotification(id);
  }
}
