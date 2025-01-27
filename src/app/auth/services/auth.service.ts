import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User, AuthStatus, LoginResponse, CheckTokenResponse, RegisterUser } from '../interfaces';



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

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string ): boolean{
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);
    return true;
  }


  login( email: string, password: string ): Observable<boolean>{

    const url = `${ this.baseUrl }/auth/login`;
    const body = { email: email, password: password };
    // console.log(url);
    // console.log(body);
    return this.http.post<LoginResponse>(url, body )
      .pipe(
        map( ({user, token}) => this.setAuthentication(user, token)),
        // Todo: errores
        catchError( err =>  throwError( () => err.error.message ) //Este "err.error.message" lo configuramos en el backend de nest.
        )
      )
  }

  checkAuthStatus():Observable<boolean>{
    const url = `${this.baseUrl}/auth/check-token`
    const token = localStorage.getItem('token');

    //El of()
    //  de rxjs es para cumplir con el retorno de un booleano observable, por que el tipo de funcion observable no admite un return directo de un bool, como por ej "return true"
    if(!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, {headers:headers})
      .pipe(
        //Desestructuramos el "CheckTokenResponse" en "{token, user }"
        map( ({token, user }) => this.setAuthentication(user, token)
        //   {
        //   this._currentUser.set( user );
        //   this._authStatus.set( AuthStatus.authenticated );
        //   localStorage.setItem('token', token);
        //   return true
        // }
      ),

        catchError(() => {
          this._authStatus.set(AuthStatus.notAuthenticated );
          return of(false)
        })
      )
  }

  register(user: RegisterUser){

    const url = `${ this.baseUrl }/auth/register`;
    const {email, name, password, confirmPassword} = user;
    const body = { email, name, password, confirmPassword };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
          map( ({user, token}) => this.setAuthentication(user, token)),
          catchError( err =>  throwError( () => err.error.message ) //Este "err.error.message" lo configuramos en el backend de nest.
        )
      )
  }


  logout(){
    //al hacer el logout no debemos hacer redirección por lo que en el app.component.ts tenemos el effect() que se encarga de monitorear cada señal.
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);

  }





}
