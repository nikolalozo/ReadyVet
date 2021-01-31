import { Component, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {
  @Input() comment: string;
  @Input() mark: number;
  @Input() name: string;
  @Input() surname: string;
  @Input() date;

  getDate(date) {
    return moment(date).format('MM.DD.YYYY');
  }
}
