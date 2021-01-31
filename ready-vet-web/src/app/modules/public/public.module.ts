import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './components/login/login.component';
import { ConfirmEmailInfoComponent } from './components/confirm-email-info/confirm.email.info.component';
import { PublicWrapperComponent } from './components/public-wrapper/public-wrapper.component';
import { MedicalServicesComponent } from './components/medical-services/medical-services.component';
import { VeterinariansProfilesComponent } from './components/veterinarians-profiles/veterinarians-profiles.component';
import { MedicalServisRequestComponent } from './components/medical-servis-request/medical-servis-request.component';
import { ContactComponent } from './components/contact/contact.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { HomeComponent } from './components/home/home.component';
import { CommentsComponent } from './components/comments/comments.component';
import { CardComponent } from './components/card/card.component';
import { VetProfileComponent } from './components/vet-profile/vet-profile.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';


const routes: Routes = [{
  path: '',
  component: PublicWrapperComponent,
  children: [
    { path: 'home', component: HomeComponent, pathMatch: 'full' },
    { path: 'medical-services', component: MedicalServicesComponent, pathMatch: 'full' },
    { path: 'veterinarians', component: VeterinariansProfilesComponent, pathMatch: 'full' },
    { path: 'medical-service-request', component: MedicalServisRequestComponent, pathMatch: 'full' },
    { path: 'contact', component: ContactComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'register', component: RegisterComponent, pathMatch: 'full' },
    { path: 'confirm-email-info', component: ConfirmEmailInfoComponent, pathMatch: 'full' },
    { path: 'veterinarian/:_id', component: VetProfileComponent, pathMatch: 'full' },
    { path: '**', redirectTo: 'home' },
  ]
}];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    LoginComponent,
    ConfirmEmailInfoComponent,
    RegisterComponent,
    HomeComponent,
    PublicWrapperComponent,
    MedicalServicesComponent,
    VeterinariansProfilesComponent,
    MedicalServisRequestComponent,
    ContactComponent,
    ConfirmComponent,
    CommentsComponent,
    CardComponent,
    VetProfileComponent,
    LoginModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PublicModule {}
