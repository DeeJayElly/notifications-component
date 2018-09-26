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
  public notificationExpired: Notification | any;

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
    const localNotifications = this.notificationsService.getLocalNotifications();
    if (localNotifications && localNotifications.length) {
      this.notifications = localNotifications;
    } else {
      this.notificationsService.fetchAllNotifications().then(function (res) {
        if (res && res.length) {
          this.notifications = res;
          this.isLoadingNotifications = false;
          this.checkForNotificationsLength();
        }
      }.bind(this));
    }
  }

  /**
   * Check for notifications length and remove if expired function
   */
  private checkForNotificationsLength() {
    this.notificationsService.notificationsExpireChecker.subscribe(time => {
      this.notificationExpired = this.notifications.filter((notification: Notification) => {
        if (notification.expires && !notification['isExpired']) {
          const currentNotificationLengthTimeMs = new Date().getTime() - notification['notificationCreationTime'];
          const notificationExpiresAtMs = notification.expires * 1000 * 60;
          if (currentNotificationLengthTimeMs > notificationExpiresAtMs) {
            console.log('Notification expired');
            notification['isExpired'] = true;
            return notification;
          }
        }
      });
      if (this.notificationExpired.length) {
        this.notificationExpired.map(item => {
          this.notificationsService.removeNotification(item.id);
        });
      }
    });
  }

  /**
   * Open notifications list function
   */
  public openNotificationsList() {
    this.notifications = this.notificationsService.getLocalNotifications();
    const menuPanel = $('.mat-menu-panel');
    if (menuPanel) {
      menuPanel.css('margin-top', '20px');
      menuPanel.css('border-radius', '5px');
      menuPanel.css('position', 'relative');
    }
    this.createBubleOnElement();
  }

  /**
   * On close notifications list function
   */
  public notificationListMenuClosed() {
    const menuPanelAfter = $('.bubble-element');
    if (menuPanelAfter) {
      menuPanelAfter.remove();
    }
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

  /**
   * Create bubble element before element function
   */
  private createBubleOnElement() {
    const menuPanel = $('.mat-menu-panel');
    menuPanel.before($('<div class="bubble-element"></div>'));
    const menuPanelAfter = $('.bubble-element');
    menuPanelAfter.css('content', '');
    menuPanelAfter.css('position', 'absolute');
    menuPanelAfter.css('top', '30px');
    menuPanelAfter.css('right', '5%');
    menuPanelAfter.css('width', '0');
    menuPanelAfter.css('height', '0');
    menuPanelAfter.css('border', '22px solid transparent');
    menuPanelAfter.css('border-bottom-color', '#6A98EE');
    menuPanelAfter.css('border-top', '0');
    menuPanelAfter.css('margin-left', '-22px');
    menuPanelAfter.css('margin-top', '-22px');
  }
}
