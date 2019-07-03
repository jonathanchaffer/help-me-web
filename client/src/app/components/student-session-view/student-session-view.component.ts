import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { QuestionService } from '../../services/question.service';
import { SessionView } from '../../session-view';
import { Question } from '../../models/question.model';
import { User } from '../../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotifierService } from 'angular-notifier';
import { LabSessionService } from '../../services/labsession.service';
import { LabSession } from '../../models/lab_session.model';
import { QuestionListComponent } from '../question-list/question-list.component';
import { AskQuestionComponent } from '../ask-question/ask-question.component';
import { Title }     from '@angular/platform-browser';
import { ApiResponse } from '../../services/api-response';
import { AudioService } from '../../services/audio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-session-view',
  templateUrl: './student-session-view.component.html',
  styleUrls: ['./student-session-view.component.scss']
})
export class StudentSessionViewComponent extends SessionView implements OnInit {
  @Input() private allQuestions : Question[]
  private faQs: Question[];
  private myQs: Question[];
  private allOtherQs:  Question[];
  private isMeTooUser: boolean;
  private description:string;
  private subjectAndNumber:string;
  private faqHeader:string = "Frequently Asked Questions";
  private myQHeader:string = "My Questions";
  private otherQHeader:string = "All Questions";
  private readOnly: boolean = false;
  private currentDate: Date = new Date();
  private started: boolean = true;
  private startDate: Date;
  private playSound: boolean;
  private placeInLine:number;
  private myUnclaimedQs:Question[];
  private allUnclaimedQs:Question[];
  //private sess: LabSession;

  private errorSession: ApiResponse<LabSession>;
  private loadedSession : LabSession;
  private sessionMessage : string[];
  private loadSessionError: boolean;
  public href: string = "";

  @ViewChild('myonoffswitch',{static: false}) private audioSwitch;


  constructor(userService: UserService, questionService: QuestionService,
    route: ActivatedRoute, location: Location, notifierService: NotifierService, audioService: AudioService, sessionService:LabSessionService,
    private titleService: Title, private router: Router) {
      super(userService, questionService, route, location, notifierService, sessionService, audioService);
      this.faQs = new Array<Question>();
      this.myQs = new Array<Question>();
      this.allOtherQs = new Array<Question>();
      this.allUnclaimedQs = new Array<Question>();
      this.myUnclaimedQs = new Array<Question>();
  }

      ngOnInit() {
        this.playSound = false;
        this.questionService.getUpdatedQuestion$.subscribe(r => this.sortQuestions(this.questions));
        this.questionService.getNewAnswer$.subscribe(r => this.checkNotification(this.questions));
        this.getSessionDescription();
        this.checkIfEnded();
        this.titleService.setTitle(`Session View - Help Me`);
        this.checkIfStarted();
        //this.autoJoinASession();
      }

      checkIfEnded(){
        this.currentDate = new Date();
        this.sessionService.getSession(this.sessionId).subscribe(
          r => {
            if(new Date(r.Data.endDate.toString()) <= this.currentDate){
              this.readOnly = true;
            }
            else{
              this.readOnly = false;
            }
            this.getSessionError(r);
          });

      }

      checkIfStarted(){
        this.currentDate = new Date();
        this.sessionService.getSession(this.sessionId).subscribe(r => {
          this.startDate = new Date(r.Data.startDate.toString());
          let tenBefore = new Date(r.Data.startDate.toString());
          let tempDate = new Date(r.Data.startDate.toString());
          tenBefore.setMinutes(tempDate.getMinutes()-10);
          if(tenBefore < this.currentDate)
          {
            this.started = true;
          }
          else{this.started=false;}
          this.getSessionError(r);
        }
      );
      }

      checkNotification(datas : any){
        for (let data of datas){
          for (let q of this.myQs){
            if(q.id === data.id){
              //if your question was answered notification is sent (unless it was answered by yourself)
              if(q.answer === undefined){
                if(data.answer != undefined){
                  if(data.answer.user.id != this.currentUser.id){
                    if(data.step != "" && data.step != undefined){
                      if(this.playSound){this.audioService.playStudentAudio();}
                      this.notifier.notify('info', 'Your question for step ' + data.step + ' has been answered!');
                    }
                    else{
                      if(this.playSound){this.audioService.playStudentAudio();}
                      this.notifier.notify('info', 'Your question has been answered!');
                    }
                  }
                }
              }
              //if the answer to your question was editted (even if it was editted by yourself)
              else{
                if(q.answer.text != data.answer.text && data.answer.user.id != this.currentUser.id){
                  if(data.step != "" && data.step != undefined){
                    if(this.playSound){this.audioService.playStudentAudio();}
                    this.notifier.notify('info', 'The answer to your question for step ' + data.step + ' has been updated.');
                  }
                  else{
                    if(this.playSound){this.audioService.playStudentAudio();}
                    this.notifier.notify('info', 'The answer to your question has been updated.');
                  }
                }
              }
            }
          }
        }
      }

      sortQuestions(questions: Question[]){
        //clears the array
        this.faQs.length = 0;
        this.myQs.length = 0;
        this.allOtherQs.length = 0;
        this.allUnclaimedQs.length = 0;
        this.myUnclaimedQs.length = 0;

        for (let question of questions){

          this.isMeTooUser=false;

          for (let a of question.otherAskers){
            if(a.id === this.currentUser.id){
              this.isMeTooUser = true;
            }
          }

          if(this.isMeTooUser){
            //assigned or claimed by me (will keep in myQs even if professor makes it a FAQ)
            this.myQs.push(question);
            this.allOtherQs.push(question);
            //checks to see if question if user's question is unclaimed
            if(question.claimedBy.id === undefined){
              this.myUnclaimedQs.push(question);
            }

          }
          else if (question.faq){
            this.faQs.push(question);
          }
          else{
            this.allOtherQs.push(question);
          }
          if(question.claimedBy.id === undefined){
            this.allUnclaimedQs.push(question);
          }
        }
        if(this.myUnclaimedQs.length != 0){
          //then find place in line
          for(let q of this.myUnclaimedQs){
            //question are returned with least recent (high index) to most recent (low index)
            q.placeInLine = this.allUnclaimedQs.length - this.allUnclaimedQs.indexOf(q);
          }

        }
      }


      getSessionDescription(){
        this.sessionService.getSession(this.sessionId).subscribe(session =>
          {this.subjectAndNumber = session.Data.course.subjectAndNumber,
            this.description = session.Data.description, this.getSessionError(session)});
          }

      private getSessionError(session: ApiResponse<LabSession>){
        if(!session.Successful){
            this.state = "errorLoadingSession";
            this.errorSession = session;
            this.loadedSession = <LabSession>session.Data;
            this.sessionMessage = session.ErrorMessages;
            this.loadSessionError = true;
          }
          else{
            this.state = "loaded";
            this.loadedSession = <LabSession>session.Data;
          }
        }

        // autoJoinASession(){
        //   this.sessionService.getSession(this.sessionId).subscribe(session => this.session = session);
        //   debugger
        //   this.sess = <LabSession>this.session.Data;
        //   var notInList:boolean;
        //   debugger
        //   for (let member of this.sess.members){
        //     if(this.currentUser.id != member.id){
        //       notInList = true;
        //       if(notInList){
        //       this.sessionService.joinASession(this.sess.token);
        //     }
        //   }
        // }
        // }

        toggleAudio():boolean{
          this.audioSwitch.nativeElement.checked? this.playSound = true: this.playSound = false;
          this.audioService.playSilentAudio();
          return this.playSound;
        }

        }
