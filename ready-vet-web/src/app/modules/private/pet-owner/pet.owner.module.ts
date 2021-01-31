import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AnimalProfileComponent } from './animal-profile/animal-profile.component';
import { PrivatePetOwnerWrapperComponent } from './private-pet-owner-wrapper/private-pet-owner-wrapper.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MedicalRecordComponent } from './medical-record/medical-record.component';
import { HomeComponent } from '../../public/components/home/home.component';
import { MedicalServicesComponent } from '../../public/components/medical-services/medical-services.component';
import { VeterinariansProfilesComponent } from '../../public/components/veterinarians-profiles/veterinarians-profiles.component';
import { ContactComponent } from '../../public/components/contact/contact.component';
import { VetProfileComponent } from '../../public/components/vet-profile/vet-profile.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';
import { CreateFeedbackComponent } from './create-feedback/create-feedback.component';

const routes: Routes = [{
  path: '', component: PrivatePetOwnerWrapperComponent,
  children: [
    { path: 'home-pet', component: HomeComponent, pathMatch: 'full' },
    { path: 'medical-services', component: MedicalServicesComponent, pathMatch: 'full' },
    { path: 'medical-service-request', component: MedicalRecordComponent, pathMatch: 'full' },
    { path: 'veterinarians', component: VeterinariansProfilesComponent, pathMatch: 'full' },
    { path: 'contact', component: ContactComponent, pathMatch: 'full' },
    { path: 'profile', component: UserProfileComponent, pathMatch: 'full' },
    { path: 'animals/:_animal', component: AnimalProfileComponent, pathMatch: 'full' },
    { path: 'veterinarian/:_id', component: VetProfileComponent, pathMatch: 'full' },
  ]
}];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AnimalProfileComponent,
    PrivatePetOwnerWrapperComponent,
    UserProfileComponent,
    MedicalRecordComponent,
    MyRequestsComponent,
    CreateFeedbackComponent
  ]
})
export class PetOwnerModule {}
