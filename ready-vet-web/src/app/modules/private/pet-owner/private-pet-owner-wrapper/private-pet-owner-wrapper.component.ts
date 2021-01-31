import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../../../shared/services/socket.io.service';

@Component({
  selector: 'app-private-pet-owner-wrapper',
  templateUrl: './private-pet-owner-wrapper.component.html',
  styleUrls: ['./private-pet-owner-wrapper.component.css']
})
export class PrivatePetOwnerWrapperComponent implements OnInit {

  constructor(
    private readonly socketIoService: SocketIoService
  ) { }

  ngOnInit(): void {
    this.socketIoService.connect();
  }

}
