import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthPrivateGuard, AuthPublicGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'vet',
    loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule),
    canLoad: [AuthPublicGuard]
  }, {
    path: '',
    loadChildren: () => import('./modules/private/private.module').then(m => m.PrivateModule),
    canLoad: [AuthPrivateGuard]
  }, {
    path: '**',
    redirectTo: '/vet/home'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
