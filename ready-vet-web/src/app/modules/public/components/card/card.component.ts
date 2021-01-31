import { Component, OnInit, Input } from '@angular/core';
import { get } from 'lodash';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  public baseUrl = environment.baseUrl;
  @Input() title: string;
  @Input() content: string;
  @Input() image: string;
  @Input() more: string;

  constructor() { }

  ngOnInit(): void {
  }

  generateUrl(image): string {
    if (image) {
      return `${this.baseUrl}/medical-services/${image}`;
    }
  }

}
