import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject, Observer } 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userObservers: BehaviorSubject<Observerable[]> = new BehaviorSubject<Observerable[]>;
  
  constructor(private _http: HttpClient, private _cookieService: CookieService) {
  }
  
  loginUser(user: User): Observable{
		//return this._http.post<User>(`/login`, user).subscribe( success => console.log(success), err => console.log(err) );
		//console.log("hello service.", user);
		let observable: Observable = this._http.post<User>('/login', user);
		
		observable.subscribe(
			(observer: Observer) => { 
				if(observer['message'] == 'Success') { this.userObservers.next(observer['user']); return null; }
			}
		);
		
		return observable;
  }
  
  registerUser(user: User): Observable{
		//return this._http.post<User>(`/login`, user).subscribe( success => console.log(success), err => console.log(err) );
		//console.log("hello service.", user);
		//let observable: Observable = 
		
		return this._http.post<User>('/register', user);
		
		/*observable.subscribe(
			(observer: Observer) => { 
				if(observer['message'] == 'Success') { this.userObservers.next(observer['user']); this.userObservers.complete(); return null; }
			}
		);*/
		
		//return observable;
  }
  
  getLoggedInUser(): Observerable{
	  return this._http.post<User>(`/user`, {id: this._cookieService.get('userID')} );
  }
  
  logout(): boolean{
	  return this._http.delete<boolean>('/logout');
  }
  
  isAuthenticated(): boolean{
	  const id = this._cookieService.get('userID');
	  const expired = parseInt(this._cookieService.get('expiration'), 10);
	  const session = this._cookieService.get('session');
	  
	  return id && expired && session && expired > Date.now();
  }
  
}
