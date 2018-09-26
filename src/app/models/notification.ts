import {NotificationType} from '../shared/enums/notificationType';

export class Notification {
  id: number;
  type: NotificationType;
  title: string;
  text: string;
  requirement: string;
  image: string;
  link: string;
  expires: number;

  constructor(id: number, type: NotificationType, title: string,
              text: string, requirement: string, image: string,
              link: string, expires: number) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.text = text;
    this.requirement = requirement;
    this.image = image;
    this.link = link;
    this.expires = expires;
  }
}
