import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User, AuthStatus, LoginResponse, CheckTokenResponse } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject( HttpClient );

  private _currentUser = signal<User|null>( null );
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );


  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );

  constructor() { }

  login( email: string, password: string ): Observable<boolean>{

    const url = `${ this.baseUrl }/auth/login`;
    const body = { email: email, password: password };
    console.log(url);
    console.log(body);
    return this.http.post<LoginResponse>(url, body )
      .pipe(
        tap( ({user, token}) => {
          this._currentUser.set( user );
          this._authStatus.set( AuthStatus.authenticated );
          localStorage.setItem('token', token);
          console.log({user, token})
        }),
        map( () => true ),
        // Todo: errores
        catchError( err =>  throwError( () => err.error.message ) //Este "err.error.message" lo configuramos en el backend de nest.
        )
      )

    //return of(true);
  }

  checkAuthStatus():Observable<boolean>{
    const url = `${this.baseUrl}/auth/check-token`
    const token = localStorage.getItem('token');

    //El of de rxjs es para cumplir con el retorno de un booleano observable, por que el tipo de funcion observable no admite un return directo de un bool, como por ej "return true"
    if(token) return of(false);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, {headers:headers})
      .pipe(
        map( ({token, user }) => {
          this._currentUser.set( user );
          this._authStatus.set( AuthStatus.authenticated );
          localStorage.setItem('token', token);
          return true
        }),

        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated );
          return of(false)
        })
      )


  }

}
