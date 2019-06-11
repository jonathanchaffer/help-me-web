import { Component, OnInit, Inject} from '@angular/core';
import { Router } from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {Course} from '../../models/course.model';
import { LabSession } from '../../models/lab_session.model';
import { LabSessionService } from '../../services/labsession.service';
import { CourseService } from '../../services/course.service';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-start-session',
  templateUrl: './start-session.component.html',
  styleUrls: ['./start-session.component.scss'],
})


export class StartSessionComponent implements OnInit {
  closeResult: string;
  private description: string;
  private year: string;
  private startCourse : Course[];
  private generatedCode: string;
  private newSessionDescription:string;
  private newSession: LabSession;
  private newCourse: Course;
  private todayYear: number;
  private selectedCourse : Course;
  private fullStartDate:string;
  private fullEndDate:string;
  private start_date: {year:number, month:number, day:number}; //Date;
  private end_date: {year:number, month:number, day:number}; //Date
  private start_time: {hour:number, minute:number, second:number};
  private end_time: {hour:number, minute:number, second:number};
  private startBeforeEnd: boolean;
  private coursesRetrieved: boolean = false;


  constructor( @Inject(DOCUMENT) public document: Document,
  private router : Router, private labSessionService: LabSessionService, private courseService: CourseService, private modalService: NgbModal){

  }

  ngOnInit() {
    this.startBeforeEnd =true;
    this.courseService.coursesList().subscribe(
      courses => {this.coursesRetrieved=true; this.startCourse = courses; if (courses.length> 0){this.selectedCourse = this.startCourse[0]}});
      this.courseService.newCourse$.subscribe(c => {this.startCourse.unshift(c); this.selectedCourse= c});
    }



  startSession(){
    this.createStartEnd();
    this.compareStartEnd();
      if(this.startBeforeEnd){
    this.labSessionService.createNewLabSession(this.description, this.selectedCourse.id, this.fullStartDate, this.fullEndDate).subscribe(
      r => {this.newSession = r; this.generatedCode=this.newSession.token; this.newSessionDescription=this.newSession.description});
    }
    }

    createStartEnd(){
      this.fullStartDate = this.start_date.year +"-"+ this.start_date.month  +"-"+ this.start_date.day +"T"+ this.start_time.hour +":"+
       this.start_time.minute +":"+ this.start_time.second +"Z";
       this.fullEndDate = this.end_date.year +"-"+ this.end_date.month  +"-"+ this.end_date.day +"T"+ this.end_time.hour +":"+
        this.end_time.minute +":"+ this.end_time.second +"Z";

    }
    compareStartEnd(){
      //Converts the numbers to correctly formated strings and then changes them to numbers
      let startDate:string = ""+this.start_date.year + this.formatDigit(this.start_date.month) +
      this.formatDigit(this.start_date.day) + this.formatDigit(this.start_time.hour) +
       this.formatDigit(this.start_time.minute) + this.formatDigit(this.start_time.second);
       let sd:number = +startDate;
      let  endDate:string = ""+this.end_date.year + this.formatDigit(this.end_date.month) +
      this.formatDigit(this.end_date.day) + this.formatDigit(this.end_time.hour) +
        this.formatDigit(this.end_time.minute) + this.formatDigit(this.end_time.second);
        let ed:number = +endDate;
      if(sd < ed){
        this.startBeforeEnd = true;
      }
      else{
        this.startBeforeEnd = false;
      }
    }

    //Gives padding zeros as placeholders when converting date and time to number
    formatDigit(n:number):string{
      let s = n+"";
      while(s.length < 2) s="0"+s;
      return s;
    }

    copySessionCode(){
      let selBox = this.document.createElement('textarea');
      selBox.value=this.newSession.token;
      this.document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      this.document.execCommand('copy');
      this.document.body.removeChild(selBox);
    }

    copySessionLink(){
      let selBox = this.document.createElement('textarea');
      let url =`${environment.server}/lab_sessions/${this.newSession.id}`;
      selBox.value=url; ///////NEED TO CHANGE THIS TO URL TO GO TO SESSION
      this.document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      this.document.execCommand('copy');
      this.document.body.removeChild(selBox);
    }


  open(content) {
    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-course'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log("Testing Modal");
    this.courseService.newCourse$.subscribe(
      course => this.modalService.dismissAll()
    );
  }

  open2(content2) {
    if(this.startBeforeEnd){
    let modal= this.modalService.open(content2, <NgbModalOptions>{ariaLabelledBy: 'modal-create-new-session'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
    //this.courseService.newCourse$.subscribe(
    //   course => this.modalService.dismissAll()
    // );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }




    }
