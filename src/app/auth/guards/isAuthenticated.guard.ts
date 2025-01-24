import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  // const url = state.url;
  // localStorage.setItem('url', url);
  // console.log({url});

  const authService = inject( AuthService );
  const router = inject( Router )
  console.log({ status: authService.authStatus() }, 'isAuthenticated.guard.ts');

  if( authService.authStatus() === AuthStatus.authenticated ){
    return true;
  }

  // console.log('isAuthenticatedGuard');
  // console.log({route, state});

  router.navigateByUrl('/auth/login')
  return false;
};
