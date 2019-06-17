import { Component, OnInit, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { Observable } from 'rxjs/Observable';
import {NgbModal, NgbActiveModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';


@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {
  private currentQuestion : Question;
  closeResult: string;
  saved : boolean = false;
  blured = false;
  focused = false;

  constructor(private activeModal: NgbActiveModal, private questionService: QuestionService, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  editAnswerFromForm(){
    this.saved = true;
    this.questionService.editAnAnswer(this.currentQuestion, this.currentQuestion.answer.text).subscribe(r => this.activeModal.close());
  }

  created(event) {
    // tslint:disable-next-line:no-console
    console.log(event)
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event)
    this.focused = true
    this.blured = false
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event)
    this.focused = false
    this.blured = true
  }
}