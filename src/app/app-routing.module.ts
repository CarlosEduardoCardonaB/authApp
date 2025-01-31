import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './auth/guards';


const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  //el {useHash: true} nos sirve para colocar el hash en la url cuando despleguemos en prod, esto por lo que al recargar las
  //páginas si no tenemos este /#/ nos va a arrojar un "Page not found". Las url quedarían asi "http://localhost:4200/#/auth/login"
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
