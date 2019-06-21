import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import { LabSessionService } from '../../services/labsession.service';
import { UserService } from '../../services/user.service';
import { Observable, of, from } from 'rxjs';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { Answer } from '../../models/answer.model';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import {EditModalComponent} from '../edit-modal/edit-modal.component';
import {AnswerModalComponent} from '../answer-modal/answer-modal.component';
import {AssignModalComponent} from '../assign-modal/assign-modal.component';
import {DeleteModalComponent} from '../delete-modal/delete-modal.component';
import * as moment from 'moment';


@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  private timeDifference:string;
  //Each question has own selected action and determinant of whether the answer is showing or not
  private selectedAction: Array<string>;
  public toggleAnswer: Array<boolean>;

  private currentUser : User;
  private currentQuestion: Question;
  private actions;
  private closeResult: string;
  private editText : string;
  private answerText:string;
  private searchText:string;
  private step: string;
  private i:number;

  //this variable helps when the dropdown menu is in use.
  private actionSelected:boolean =false; // Because the action of the button happens before the action of the menu closing, this helps make sure that when the menu closes it doesn't interfere with the refresh status for the element.
  private copied: boolean;


  @Input() private questions : Question[];
  @Input() private filteredQuestions : Question[];
  @Input() private currentDate: Date;
  @Input() private header: string;
  @Input() private showDate: boolean = false;
  @Input() private showCourse: boolean = false;
  @Input() private showAskedBy: boolean = false;
  @Input() private showTags: boolean = false;
  @Input() private showTimeInQueue: boolean = false;
  @Input() private showAnswer: boolean = true;
  @Input() private showAction: boolean = true;
  @Input() private showAnswerButton: boolean = false;
  @Input() private showEditButton: boolean = false;
  @Input() private showClaimButton: boolean = false;
  @Input() private showAssignButton: boolean = false;
  @Input() private showFAQButton: boolean = false;
  @Input() private showDeleteButton: boolean = false;
  @Input() private showMeTooButton: boolean = false;
  @Input() private showStep: boolean = true;
  @Input() private showNumberOfAskers: boolean = false;
  @Input() private showUnclaimButton: boolean = false;
  @Input() private showClaimedBy: boolean = false;
  @Input() public isCollapsed: boolean = true;
<<<<<<< HEAD
  @Input() private readOnly: boolean = false;
  @Input() private showCheck: boolean = false;
  @Input() private allowSelection: boolean = false;
	@Input() private isCollapsible: boolean = true;
	@Input() private showSearch : boolean = true;
  @Input() public answer : Answer;
=======
>>>>>>> parent of 7de0950... autoSave changes

  @Output() public refreshEvent: EventEmitter<any> = new EventEmitter();
  @Output() public pauseRefresh: EventEmitter<any> = new EventEmitter();



  constructor(private questionService: QuestionService, private labsessionService: LabSessionService, private userService: UserService,
    private modalService: NgbModal) {

      this.userService.CurrentUser$.subscribe(
        u => this.currentUser = u);

        this.actions = {
          "answer": this.answerQuestion,
          "edit": this.editQuestion,
          "claim": this.claimQuestion,
          "unclaim": this.unclaimQuestion,
          "assign": this.assignQuestion,
          "removeFaQ": this.removeFaqQuestion,
          "addFaQ": this.addFaqQuestion,
          "delete": this.deleteQuestion,
          "meToo": this.meTooQuestion,
          "questionService": this.questionService,
          "labsessionService": this.labsessionService,
          "modalService":this.modalService,
          "openEdit":this.openEdit,
          "openAnswer":this.openAnswer,
          "openAssign":this.openAssign,
          "openDelete":this.openDelete,
          "currentUser": this.currentUser,
          "copy": this.copy,
          "refreshData": this.refreshData,
          "refreshEvent": this.refreshEvent,
          "setPauseRefresh":this.setPauseRefresh,
          "pauseRefresh": this.pauseRefresh,

          "getDismissReason":this.getDismissReason,
        }
      }

      ngOnInit() {
        this.selectedAction = new Array<string>();
        this.toggleAnswer = new Array<boolean>();
      }

			headerStyles() {
				let size : string = this.allowSelection ? "150%" : "100%";
				return {
					"font-size": size
				};
			}

      private timeDiff(question: Question) : string{
        return this.timeDifference = moment(question.date).fromNow();
      }

      private stepTextTime(question: Question): Object[]{
        console.log();
        let tempArray = new Array<Object>();
        this.timeDifference = moment(question.date).fromNow();
        tempArray.push(question.text);
        //tempArray.push(JSON.parse('{"insert": this.timeDifference}'));
        this.step = question.step;
        return tempArray;
      }

      checkIfCollapsed():string{
        if(this.isCollapsed){
          return "Open";
        }
        else{
          return "Close"
        }
      }

      filteredQuestionsLength():number{
        if(this.filteredQuestions == undefined){
          return 0;
        }
        else{
          return this.filteredQuestions.length;
        }
      }

      doToggleAnswer(i:number){
        //true means answer is showing
        //false means answer is hidden
        if(this.toggleAnswer[i] != undefined){
          this.toggleAnswer[i] = !(this.toggleAnswer[i]);
        }
        else{
          this.toggleAnswer[i] = true;
        }
      }

      answerLabel(i:number):string{
        //true means answer is showing
        //false means answer is hidden
        if(this.toggleAnswer[i] == true){
          return "Close Answer";
        }
        else{
          return "View Answer";
        }
      }

      filter():boolean{
        if( this.searchText !=undefined && this.searchText!=""){
          return true;
        }
        else{
          return false;
        }
      }


      answerUndefined(question:Question){
        if(question.answer === undefined){
          return true;
        }
        else if(question.answer.id === undefined){
          return true;
        }
        else{ //meaning answer is defined (completely created once)
          return false;
        }
      }


<<<<<<< HEAD
      //main method for all buttons and the dropdown menu
      performSelectedAction(q: Question, i: number){
        this.currentQuestion = q;
        this.setPauseRefresh(true);
        this.actions[this.selectedAction[i]](q).subscribe(r => {this.setPauseRefresh(false); this.refreshData(r)});
        this.selectedAction[i]="";
=======
      setAnswer(){
        this.selectedAction = "answer";
      }
      setEdit(){
        this.selectedAction = "edit";
      }
      setClaim(){
        this.selectedAction = "claim";
      }
      setUnclaim(){
        this.selectedAction = "unclaim";
      }

      setAssign(){
        this.selectedAction = "assign";
      }
      setAddFaq(){
        this.selectedAction = "addFaQ";
      }
      setRemoveFaq(){
        this.selectedAction = "removeFaQ";
>>>>>>> parent of 7de0950... autoSave changes
      }

      performMenuAction(q: Question, i: number, action : string){
        this.actionSelected = true;
        this.performAction(q, i, action);
      }

      performAction (q: Question, i:number, action : string) {
        this.selectedAction[i] = action;
        this.performSelectedAction(q, i);
      }
<<<<<<< HEAD

      refreshData(r :any){
        this.refreshEvent.next(r);

      }

      setPauseRefresh(r: boolean){
        //allow for refresh to be paused (true)
        //or for it to be unpause (false)
        this.pauseRefresh.next(r);
      }

      menuPauseRefresh(event){
        if(event){
          //dropdown open
          this.pauseRefresh.next(true);
        }
        else{
          //dropdown closed and another action was not selected
          if(!(this.actionSelected)){
          this.pauseRefresh.next(false);
          //this is necesssary so that timer is initiated once again
          this.refreshEvent.next();
        }
        this.actionSelected = false;
        }
      }

      answerQuestion(question: Question):Observable<any>{
        return this.openAnswer(AnswerModalComponent, question);
      }
=======
      //methods for select element in drop down menu
      performAction(q: Question){
        this.currentQuestion = q;
        this.actions[this.selectedAction](q);
      }


      answerQuestion(question: Question){
        this.openAnswer(AnswerModalComponent, question);

      }

      editQuestion(question: Question){
        this.openEdit(EditModalComponent, question);
>>>>>>> parent of 7de0950... autoSave changes

      }
<<<<<<< HEAD

      editQuestion(question: Question):Observable<any>{
        return this.openEdit(EditModalComponent, question);
=======
      claimQuestion(question: Question){
        this.questionService.claimAQuestion(question).subscribe();
>>>>>>> parent of 7de0950... autoSave changes
      }

      claimQuestion(question: Question):Observable<any>{
        return this.questionService.claimAQuestion(question);
      }

      unclaimQuestion(question: Question):Observable<any>{
        return this.questionService.unclaimAQuestion(question);
      }

      assignQuestion(question: Question):Observable<any>{
        return this.openAssign(AssignModalComponent, question);
      }

      addFaqQuestion(question: Question):Observable<any>{
        return this.questionService.updateQuestion(question, question.text, true);
      }

      removeFaqQuestion(question: Question):Observable<any>{
        return this.questionService.updateQuestion(question, question.text, false);
      }

      deleteQuestion(question: Question):Observable<any>{
        return this.openDelete(DeleteModalComponent, question);
      }
<<<<<<< HEAD
      meTooQuestion(question: Question):Observable<any>{
        return this.questionService.addMeToo(question, true, this.currentUser);
      }

      deleteAnswer(question: Question){
        this.questionService.deleteADraft(question).subscribe();
      }
=======
      meTooQuestion(question: Question){
        this.questionService.addMeToo(question, true, this.currentUser).subscribe();
>>>>>>> parent of 7de0950... autoSave changes

      }

      copy(question: Question){
        this.labsessionService.copyQuestions.push(question);
        this.copied = true;
      }
      copyAll(questions: Question[]){
        for(let question of questions){
          this.labsessionService.copyQuestions.push(question);
        }
      }

      //Edit Modal methods
      openEdit(content, question: Question):Observable<any>{
        let modal = this.modalService.open(content,
          <NgbModalOptions>{
            ariaLabelledBy: 'modal-edit-answer',
<<<<<<< HEAD
          });
          modal.componentInstance.currentQuestion = question;
          modal.componentInstance.answererId = this.currentUser.id;
          modal.result.then(
            (result) => {
          this.setPauseRefresh(false);
          this.refreshData(result);
=======
          }
        );

        modal.componentInstance.currentQuestion = question;

        modal.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }


      //Assign Modal methods
      openAssign(content, question:Question) {
        let modal= this.modalService.open(content, <NgbModalOptions>{ariaLabelledBy: 'modal-create-course'});
        modal.componentInstance.currentQuestion = question;
        modal.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
>>>>>>> parent of 7de0950... autoSave changes
        }, (reason) => {
          this.setPauseRefresh(false);
          this.refreshData(reason);
        }
          );
          return from(modal.result);
        }


        //Assign Modal methods
        openAssign(content, question:Question):Observable<any> {
          let modal= this.modalService.open(content, <NgbModalOptions>{
            ariaLabelledBy: 'modal-create-course'});
          modal.componentInstance.currentQuestion = question;
<<<<<<< HEAD
          modal.result.then(
            (result) => {
          this.setPauseRefresh(false);
          this.refreshData(result);
        }, (reason) => {
          this.setPauseRefresh(false);
          this.refreshData(reason);
=======
          modal.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
>>>>>>> parent of 7de0950... autoSave changes
        }
          );
          return from(modal.result);
        }


        //Answer Modal methods
        openAnswer(content, question: Question):Observable<any>{
          let modal= this.modalService.open(content,
            <NgbModalOptions>{ariaLabelledBy: 'modal-create-answer', });
            modal.componentInstance.currentQuestion = question;
            modal.result.then(
              (result) => {
            this.setPauseRefresh(false);
            this.refreshData(result);
          }, (reason) => {
            this.setPauseRefresh(false);
            this.refreshData(reason);
          }
            );
            return from(modal.result);
          }

          //Delete Modal method
          openDelete(content, question: Question):Observable<any>{
            let modal= this.modalService.open(content,
              <NgbModalOptions>{ariaLabelledBy: 'modal-create-answer', });
              modal.componentInstance.currentQuestion = question;
              modal.result.then(
                (result) => {
              this.setPauseRefresh(false);
              this.refreshData(result);
            }, (reason) => {
              this.setPauseRefresh(false);
              this.refreshData(reason);
            }
              );
              return from(modal.result);
            }


          // gravatarImageUrl() : string {
          //     //debugger
          //
          //
          //     return `https://www.gravatar.com/avatar/${hashedEmail}?s=40`;
          // }

        }
