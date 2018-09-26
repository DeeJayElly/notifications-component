import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Notification} from '../models/notification';
import {Logger} from '../shared/logger';
import {AuthTools} from '../shared/auth.tools';
import {environment} from '../../environments/environment';
import {NotificationType} from '../shared/enums/notificationType';
import {interval} from 'rxjs';

@Injectable()
export class NotificationsService {
  private apiURL = environment.api;
  private notifications: Notification[] | any;
  private notificationCounter: number;
  public notificationsExpireChecker = interval(5000);

  constructor(public http: HttpClient, public logger: Logger) {
  }

  /**
   * Retrieve all notifications from api endpoint function
   */
  public async fetchAllNotifications() {
    try {
      const res = await this.http.get(this.apiURL + 'notifications', {headers: AuthTools.getRequestHeaders()}).toPromise();
      this.logger.log(res);
      this.setLocalNotifications(res);
      this.filterNotificationCountType();
      return res;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  /**
   * Fetch notification by id function
   *
   * @param {number} id
   */
  public async fetchNotificationByIdFromApi(id: number) {
    try {
      const res = await this.http.get(
        this.apiURL + 'notifications' + id,
        {headers: AuthTools.getRequestHeaders()}
      ).toPromise();
      this.logger.log(res);
      return res;
    } catch (error) {
      this.logger.error(error);
      return error;
    }
  }

  /**
   * Remove expired notification function
   *
   * @param {number} id
   */
  public removeNotification(id: number) {
    const remainingNotifications = this.notifications.filter((item: Notification) => {
      if (item.id !== id) {
        return item;
      }
    });
    this.setLocalNotifications(remainingNotifications);
    this.updateNotificationCounter();
  }

  /**
   * Return local notifications array function
   *
   * @return {Notification[] | any}
   */
  public getLocalNotifications() {
    return this.notifications;
  }

  /**
   * Set local notifications function
   *
   * @param {Notification[] | any} notifications
   */
  public setLocalNotifications(notifications: Notification[] | any) {
    notifications.map(notification => {
      if (!notification['notificationCreationTime']) {
        const notificationDate = new Date();
        notification.notificationCreationTime = notificationDate.getTime();
        notification.date = notificationDate.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true});
      }
    });
    this.notifications = notifications;
  }

  /**
   * Return local notification by id function
   *
   * @param {number} id
   * @return {any}
   */
  public getLocalNotificationById(id: number) {
    let result = 0;
    if (this.notifications[id]) {
      result = this.notifications[id];
    }
    return result;
  }

  /**
   * Set notification counter
   *
   * @param {number} counter
   */
  public setNotificationCounter(counter: number) {
    this.notificationCounter = counter;
  }

  /**
   * Get notification counter function
   *
   * @return {number}
   */
  public getNotificationCounter() {
    return this.notificationCounter;
  }

  /**
   * Update notifications counter function
   *
   * @param {number} id
   */
  public updateNotificationCounter(id?: number) {
    if (id || id === 0) {
      this.setNotificationCounter(id);
    } else {
      this.filterNotificationCountType();
    }
    return this.getNotificationCounter();
  }

  /**
   * Filter notifications and remove "bonus" type
   * in order to update the notifications counter function
   */
  private filterNotificationCountType() {
    const filteredNotifications = this.notifications.filter((item: Notification) => {
      if (item.type !== NotificationType.Bonus) {
        return item;
      }
    });
    this.setNotificationCounter(filteredNotifications.length);
  }
}
