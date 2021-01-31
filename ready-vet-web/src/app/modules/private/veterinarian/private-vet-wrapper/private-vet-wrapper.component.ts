import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../../../shared/services/socket.io.service';

@Component({
  selector: 'app-private-vet-wrapper',
  templateUrl: './private-vet-wrapper.component.html',
  styleUrls: ['./private-vet-wrapper.component.css']
})
export class PrivateVetWrapperComponent implements OnInit {
  constructor(
    private readonly socketIoService: SocketIoService
  ) { }

  ngOnInit(): void {
    this.socketIoService.connect();
  }
}
