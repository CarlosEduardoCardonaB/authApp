import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

  private authService = inject( AuthService);

  //Obtener el usuario es correcto de las siguientes 2 formas
  public user = computed( ()=> this.authService.currentUser() );
  // get user(){
  //   return this.authService.currentUser();
  // }

  onLogout(){

    //al hacer el logout no debemos hacer redirección por lo que en el app.component.ts tenemos el effect() que se encarga de monitorear cada señal.
    //Aqui modificamos la señal en el AuthService.logout() y el effect entraría a realizar la redirección por medio del switch que hay allí
    this.authService.logout();
  }

}
