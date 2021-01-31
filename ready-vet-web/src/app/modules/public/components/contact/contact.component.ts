import { Component, OnInit, ViewChild } from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import {faPhone, faMapPin} from '@fortawesome/free-solid-svg-icons';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  public readonly faClock = faClock;
  public readonly faPhone = faPhone;
  public readonly faMapPin = faMapPin;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow
  openInfo(marker: MapMarker, content) {
    this.infoWindow.open(marker)
  }
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
  }
  position = new google.maps.LatLng(this.lat, this.lng);
  constructor() { }
  ngOnInit(): void {
  }

}