import { Component, OnInit, Input } from '@angular/core';
import { LabSessionService } from '../../services/labsession.service';
import { QuestionService } from '../../services/question.service';
import { Router } from '@angular/router';
import { LabSession } from '../../models/lab_session.model';
import { Question } from '../../models/question.model';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  private sessions : LabSession[];
  private myQuestions : Question[];
  private invalidId: boolean;
  private token: string;
  private currentDate: Date;
  private started: boolean;
  closeResult: string;

  constructor(private labSessionService : LabSessionService, private questionService: QuestionService,private modalService: NgbModal,
    private router : Router) { }

  ngOnInit() {
    this.labSessionService.labSessions().subscribe (
      sessions => this.sessions = sessions
    );

    this.questionService.questionList().subscribe (
      questions => this.myQuestions = questions
    );
    this.invalidId= false;

  }

  joinSess(content){
    debugger
    this.labSessionService.joinASession(this.token).subscribe(
      sessionId => {debugger;
        if(sessionId != undefined){
          this.invalidId = false;
      }
      else{
        this.invalidId = true;
      }
      this.checkIfStarted(sessionId, content);
  })
}

  checkIfStarted(id: string, content){
    this.currentDate = new Date();
    this.labSessionService.getStartDate(this.token).subscribe(r =>
      {
        let tenBefore = new Date(r.toString());
        tenBefore.setMinutes(r.getMinutes()-10);
        debugger
        if(this.currentDate < tenBefore){
          this.started = false;
          this.open(content);
        }
        else{
          this.started = true;
          this.router.navigateByUrl(`/lab_sessions/${id}`);
        }
        }
      );
  }

  open(content) {
    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-not-started'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

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
