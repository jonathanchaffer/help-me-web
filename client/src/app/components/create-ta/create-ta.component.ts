import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-ta',
  templateUrl: './create-ta.component.html',
  styleUrls: ['./create-ta.component.scss']
})
export class CreateTAComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  tempUsers: User[];
  tempUser: User;


  constructor(private userService: UserService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  createTA(){
    let newLastName = this.lastName + "(TA)";
    let email = this.email.substring(0,this.email.indexOf('@')) + "+ta" + this.email.substring(this.email.indexOf('@'));
    let password = Math.random().toString(32).slice(2);
    password = password.substring(0,8);
    debugger;
    let user = new User();
    user.FirstName = this.firstName;
    user.LastName = this.lastName;
    user.EmailAddress = email;
    user.Password = password;
    user.Username = this.firstName +"_"+this.lastName;
    user.Type = "Student";
    this.userService.createTA(user).subscribe(user => {debugger;this.userService.promoteToTA(user.Data.id).subscribe();debugger});

    this.modalService.dismissAll();
}

  //generateRandom()
}
