import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PrivateVetWrapperComponent } from './private-vet-wrapper/private-vet-wrapper.component';
import { NavbarVeterinarianComponent } from './navbar-veterinarian/navbar-veterinarian.component';
import { HomeVeterinarianComponent } from './home-veterinarian/home-veterinarian.component';
import { AnimalFormComponent } from './animal-form/animal.form.component';
import { VetProfileComponent } from '../../public/components/vet-profile/vet-profile.component';
import { HomeAdminComponent } from '../admin/home-admin/home-admin.component';
import { MedicalServiceFormComponent } from '../admin/medical-service-form/medical-service-form.component';
import { HomeComponent } from './home/home.component';
import { VeterinariansProfilesComponent } from '../../public/components/veterinarians-profiles/veterinarians-profiles.component';
import { MedicalServicesComponent } from '../../public/components/medical-services/medical-services.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AllMedicalExaminationComponent } from './all-medical-examination/all-medical-examination.component';
import { MedicalRequestsComponent } from './medical-requests/medical-requests.component';
import { MedicalRecordsVetComponent } from './medical-records-vet/medical-records-vet.component';
import { AnimalProfileComponent } from '../pet-owner/animal-profile/animal-profile.component';
import { NewMedicalRecordComponent } from './new-medical-record/new-medical-record.component';
import { UserProfileComponent } from '../pet-owner/user-profile/user-profile.component';

const routes: Routes = [{
  path: '', component: PrivateVetWrapperComponent,
  children: [
  { path: 'home-vet', component: HomeComponent, pathMatch: 'full' },
  { path: 'records', component: MedicalRecordsVetComponent, pathMatch: 'full' },
  { path: 'requests', component: MedicalRequestsComponent, pathMatch: 'full' },
  { path: 'new-medical-service', component: MedicalServiceFormComponent, pathMatch: 'full' },
  { path: 'new-animal-profile', component: AnimalFormComponent, pathMatch: 'full' },
  { path: 'all-medical-services', component: MedicalServicesComponent, pathMatch: 'full' },
  { path: 'team', component: VeterinariansProfilesComponent, pathMatch: 'full' },
  { path: 'all-users', component: AllUsersComponent, pathMatch: 'full' },
  { path: 'animals/:_animal/add-medical-examination/:_medicalRecord', component: NewMedicalRecordComponent, pathMatch: 'full' },
  { path: 'all-medical-exams', component: AllMedicalExaminationComponent, pathMatch: 'full' },
  { path: 'animals/:_animal', component: AnimalProfileComponent, pathMatch: 'full' },
  { path: 'profile/:_id', component: VetProfileComponent, pathMatch: 'full' },
  { path: 'edit-medical-service/:_id', component: MedicalServiceFormComponent, pathMatch: 'full' },
  { path: 'all-users/user/:_id', component: UserProfileComponent, pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
  AnimalFormComponent,
  PrivateVetWrapperComponent,
  NavbarVeterinarianComponent,
  HomeVeterinarianComponent,
  HomeAdminComponent,
  MedicalServiceFormComponent,
  HomeComponent,
  AllUsersComponent,
  AllMedicalExaminationComponent,
  MedicalRequestsComponent,
  MedicalRecordsVetComponent,
  NewMedicalRecordComponent
  ]
})
export class VeterinarianModule {}
