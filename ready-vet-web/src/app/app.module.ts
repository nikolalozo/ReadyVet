import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: { position: 'right', distance: 12, },
    vertical: { position: 'top', distance: 25, }
  },
  theme: 'material',
  behaviour: { autoHide: 4500, onClick: 'hide', onMouseover: false, showDismissButton: true, stacking: 1 },
  animations: {
    enabled: true,
    show: { preset: 'slide', speed: 300, easing: 'ease'},
    hide: { preset: 'fade', speed: 300, easing: 'ease', offset: 50 },
    shift: { speed: 300, easing: 'ease' },
    overlap: 150
  }
};

const socketConfig: SocketIoConfig = {
  url: environment.apiUrl,
  options: {
    transports: ['websocket']
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ModalModule.forRoot(),
    SharedModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    CommonModule,
    AppRoutingModule,
    PaginationModule.forRoot(),
    AccordionModule.forRoot(),
    NgSelectModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(socketConfig)
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
