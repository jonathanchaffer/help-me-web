import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { UserService } from './services/user.service';
import { QuestionService } from './services/question.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Question } from './models/question.model';
import { User } from './models/user.model';
import { Observable, interval, Subscription, timer } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import { LabSessionService } from './services/labsession.service';
import { LabSession } from './models/lab_session.model';
import * as moment from 'moment';


export abstract class SessionView  {
  questions: Question[];
  currentUser: User;
  protected data : any;
  private questionSubscription : Subscription;
  private timerSubscription : Subscription;
  protected sessionId: string;
  protected readonly notifier: NotifierService;
  protected timeFromRefresh: string;

  constructor(protected userService : UserService, protected questionService: QuestionService,  private route: ActivatedRoute, privatelocation: Location, protected notifierService: NotifierService, protected sessionService:LabSessionService) {
    this.questionService.getSessionQuestions(this.route.snapshot.paramMap.get('id')).subscribe(questions => {this.questions = questions; this.sortQuestions(this.questions);});
    this.userService.CurrentUser$.subscribe(
      u => this.currentUser = u
    );
    this.sessionId = this.route.snapshot.paramMap.get('id');
    this.refreshData();
    this.notifier = notifierService;
  }

  //want to make this abstract method but must make this an abstract createNewLabSession
  //to make this an abstract class can't have a constructor because can't instantiate
  //an abstract class
  abstract sortQuestions(questions: Question[]); //may switch to specific user attribute such as type or id

  abstract checkNotification( data : any );//allows different notifications depending on the specific user

  private refreshData(){
    this.questionSubscription = this.questionService.getSessionQuestions(this.route.snapshot.paramMap.get('id')).subscribe(data => {
      this.checkNotification(data);
      this.data = data; this.sortQuestions(this.data);
      this.subscribeToData();
      this.time();
    });
  }

  private subscribeToData(){
    this.timerSubscription = timer(3000).subscribe(() => this.refreshData());
  }

  public ngOnDestroy(){
    if (this.questionSubscription){
      this.questionSubscription.unsubscribe();
    }
    if (this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }
  }

  time(){
    this.timeFromRefresh = moment().format('LTS');
  }
}
