import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environments } from '../../../environments/environments';
import { User } from '../interfaces/auth.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;


  constructor(
    private http: HttpClient,
  @Inject(PLATFORM_ID) private platformId: object
  ) { }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  login (email:string, password: string): Observable<User> {

return this.http.get<User>(`${ this.baseUrl }/users/1`)
.pipe(
  tap( user => {  this.user = user}),
  tap( () => {
    if(isPlatformBrowser(this.platformId)){
      localStorage.setItem('token', 'ashdgsjdj.asajsaj')
    }}
))
  }

  checkAuthentication(): Observable<boolean>  {
if(!isPlatformBrowser(this.platformId)) {
  return of(false);
}
    const token = localStorage.getItem('token');
if( !token) return of (false);


return this.http.get<User>(`${this.baseUrl}/users/1`)
.pipe(
  tap(user => this.user = user),
  map(user =>!!user),
catchError(error => of(false))
)

}

logout() {
  this.user= undefined;
  if(isPlatformBrowser(this.platformId)){

    localStorage.clear();
  }
}
  }



