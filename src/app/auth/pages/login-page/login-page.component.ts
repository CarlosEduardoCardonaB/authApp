import { Component, inject } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {

  private fb = inject( FormBuilder );
  private authService = inject( AuthService );
  private router = inject( Router );

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email ]],
    password: ['', [Validators.required, Validators.minLength(6) ]],
  });

  login(){
    //console.log( this.myForm.controls['email'].value );
    //console.log(this.myForm.value)
    const { email, password } = this.myForm.value
    this.authService.login(email, password)
      .subscribe({
        //El next se usa para continuar en caso de que la petición haya salido bien
        next: () => {
          //console.log('todo bien');
          this.router.navigateByUrl('/dashboard');

        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
          //console.log({ loginError: message });
        }
      })

  }

 }

