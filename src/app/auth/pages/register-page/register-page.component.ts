import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styles: ``
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  private authServie = inject( AuthService);
  private router = inject( Router );

  public notEqualPasword: boolean = true;

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });



  //Todo: Crer el formulario de register page
  register(){
      const {email, name, password, confirmPassword} = this.myForm.value;

      if( password != confirmPassword){
        this.notEqualPasword = false;
        return;
      };

      this.notEqualPasword = true;

      this.authServie.register({email, name, password, confirmPassword})
        .subscribe({
          next: () => {
            //console.log('todo bien');
            this.router.navigateByUrl('/dashboard');
          },
          error: (message) => {
           Swal.fire(`Error: ${message} error` );
          }
        })
  };






}
