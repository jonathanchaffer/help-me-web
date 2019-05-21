import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  
  constructor(private userService : UserService, private router : Router) {

  }

  ngOnInit() {}

  logout () : void {
    this.userService.logout().subscribe (
      success => this.handleLogoutResponse(success)
    );
  }

  private handleLogoutResponse(wasLoggedOut : boolean) {
    if (wasLoggedOut) {
      this.router.navigateByUrl("/login");
    }
  }
}