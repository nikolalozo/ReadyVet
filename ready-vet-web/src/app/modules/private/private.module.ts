import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthPrivateVeterinarianGuard, AuthPrivatePetOwnerGuard } from './auth.private.guard';
import { ChooseDoctorComponent } from './choose-doctor/choose-doctor.component';
import { ChooseAnimalComponent } from './choose-animal/choose-animal.component';

const routes: Routes = [
  { path: 'veterinarian',
   loadChildren: () => import('src/app/modules/private/veterinarian/veterinarian.module').then(m => m.VeterinarianModule),
   canLoad: [AuthPrivateVeterinarianGuard]
  }, { path: 'pet-owner',
   loadChildren: () => import('src/app/modules/private/pet-owner/pet.owner.module').then(m => m.PetOwnerModule),
   canLoad: [AuthPrivatePetOwnerGuard]
  },
  { path: '**', redirectTo: '/veterinarian/home-vet' }
];


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
  ChooseDoctorComponent,
  ChooseAnimalComponent],
  providers: []
})
export class PrivateModule {}
