import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import * as $ from "../../jquery-3.3.1.min.js";
import { Observable, BehaviorSubject, Observer, of, from } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  states: string[] = ['Alaska', 'Alabama', 'Arizona', 'Arkansas','California','Colorado','Conneticuit', 'Delaware', 'District of Columbia', 'Florida', 
					  'Georgia', 'Hawaii', 'Idaho', 'Indiana', 'Illinois', 'Iowa', 'Louisiana', 'Kentucky', 'Maine', 'Maryland', 'Massachuesetts', 
					  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'New Jersey', 'New Mexico','New York','New Hampshire', 'North Carolina',
					  'North Dakota', 'Nevada', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania','Rhode Island','South Dakota', 'Tennessee','Texas','Utah',
					  'Vermont', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming','Virginia'];
  
  user: User = new User();
  guest: User = new User();
  errors: {email: null, birthday: null};
  
  constructor(private _authenticationService: AuthenticationService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
	  if(this._authenticationService.isAuthenticated()) this._router.navigate(['/dashboard']);
  }
  
  register(guest: User): void{
		this._authenticationService.registerUser(this.guest).subscribe( result => { 
			if(result['message'] == "Success") this.login(result['user']);
			else if(result['message'] == "Error") { this.errors = result['errors']; }
		}, err => console.log(err) );
  }
  
   login(guest: User): void{
	
	this._authenticationService.loginUser(this.guest);

	this._authenticationService.userObservers.subscribe(
		(user: any) => { this.user = user; this._router.navigate(['/dashboard']); }
	)
  }
  
}
