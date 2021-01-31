import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileUploadModule } from 'ng2-file-upload';
import { RouterModule } from '@angular/router';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { appRoutingProviders } from '../../auth.guard';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PublicNavbarComponent } from '../public/components/public-navbar/public-navbar.component';
import { SocketIoService } from './services/socket.io.service';
import { ChartsModule } from 'ng2-charts';
import { FooterComponent } from '../public/components/footer/footer.component';
import { GoogleMapsModule } from '@angular/google-maps';

const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  FontAwesomeModule,
  NgSelectModule,
  PaginationModule,
  NgbModule,
  FileUploadModule,
  RouterModule,
  BsDatepickerModule.forRoot(),
  TabsModule.forRoot(),
  ChartsModule,
  GoogleMapsModule
];

@NgModule({
  imports,
  exports: [
    imports,
    PublicNavbarComponent,
    FooterComponent
  ],
  declarations: [
    PublicNavbarComponent,
    FooterComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        appRoutingProviders,
        ApiService,
        AuthService,
        SocketIoService
      ]
    };
  }
}
