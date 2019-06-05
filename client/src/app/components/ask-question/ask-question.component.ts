import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnInit {
  closeResult: string;
  private possibleMatches: Question[];
  private step: number;
  private questionMessage: string;
  @Input() session: string;

  constructor(private modalService: NgbModal, private questionService: QuestionService) { }

  ngOnInit() {
  }

  open(content){
    let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-ask-question'}).result.then((result) => {
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

  createQuestion(){
    debugger
    this.questionService.askQuestion(this.questionMessage, this.session).subscribe();
  }
}
