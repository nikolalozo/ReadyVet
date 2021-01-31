import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { get } from 'lodash';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { faMapMarker, faMailBulk, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  public readonly faMapMarker = faMapMarker;
  public readonly faMailBulk = faMailBulk;
  public readonly faPhoneAlt = faPhoneAlt;
  public footerExists = true;
  public where = {
    sort: '-createdAt',
    limit: 6,
    page: 1,
    search: '',
  };
  zoom = 17;
  lat = 43.321683;
  lng = 21.915094;
  center = new google.maps.LatLng(this.lat, this.lng);
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    minZoom: 8
  };

  position = new google.maps.LatLng(this.lat, this.lng);

  constructor(
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(changeUrl => {
      if ((get(changeUrl, 'url') || '').includes('login') || (get(changeUrl, 'url') || '').includes('register')) {
        this.footerExists = false;
      } else {
        this.footerExists = true;
      }
    });
  }

  openInfo(marker: MapMarker, content) {
    this.infoWindow.open(marker);
  }
}
