import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { API_SERVER } from '../app.config';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { LabSession } from '../models/lab_session.model';
import { Course } from '../models/course.model';
import { User } from '../models/user.model';
import { map, catchError, tap, delay, timeout } from 'rxjs/operators';
import { ModelFactoryService } from './model-factory.service';
import { of } from 'rxjs/observable/of';


class LabsessionResponseAttributes {
  public description : string;
  public token : string;
  public activeStatus : boolean;
  public course_id : number;
  public start_date: Date;
  public end_date: Date;
}

class LabsessionResponseRelationships{
  public questions : LabsessionQuestionsData;
  public users: LabsessionResponseUsers;
  public course: LabsessionResponseCourse;
}

class LabsessionQuestionsData{
  public data : string[];
}

class LabsessionResponseUsers {
  public data : LabsessionResponseUsersData;
}

class LabsessionResponseUsersData {
  public id : number;
  public type: string;
}

class LabsessionResponseCourse {
  public data: LabsessionResponseCourseData;
}

class LabsessionResponseCourseData {
  public id: number;
  public type: string;
}


class LabsessionResponseData {
  constructor(private)
  public type : string;
  public id : number;
  public attributes: LabsessionResponseAttributes;
  public relationships : LabsessionResponseRelationships;
}

class LabsessionResponse {
  constructor (private data : LabsessionResponseData) {
	}
  get Type() : string { return this.data.type }
  get Id() : number { return this.data.id }
  get Description() : string { return this.data.attributes["description"] }
  get Token() : string { return this.data.attributes["token"] }
  get ActiveStatus() : boolean { return this.data.attributes["active"] }
  get StartDate() : Date { return this.data.attributes["start-date"]}
  get EndDate() : Date { return this.data.attributes["end-date"]}
  get CourseId() : number { return this.data.attributes["course-id"]}
  get Rdata() : string[] { return this.data.relationships.questions["data"]}
  get userId() : number {return this.data.relationships.users.data["id"]}
  get userType() : string { return this.data.relationships.users.data["type"]}
}

class IncludedCourseObjResponse{
  constructor (private data: IncludedCourseObjResponseData){}
}

class IncludedCourseObjResponseData{
  public type : string;
  public id : string;
  //public attributes: ;
  //public relationships : ;

}

@Injectable()
export class LabSessionService {
//
//   private sessions : LabSession[];
//   private _currentSessions$: Subject<LabSession>;
  private apiHost : string;
//   private noSession : LabSession;
//
  constructor(private httpClient : HttpClient, private _modelFactory : ModelFactoryService,@Inject(API_SERVER) host : string) {
    this.apiHost = host;
  }
//
//   get CurrentSessions$() : Observable<LabSession> {
//     return this._currentSessions$;
//   }
//
  labSessions() : Observable<LabSession[]> {
        let url : string =`${this.apiHost}/lab_sessions`;
        return this.httpClient.get(url).pipe(
          map(r => this.createLabsessionsArray(new Array<LabsessionResponse>(r["data"]))),
          catchError(this.handleError<LabSession[]>(`labSessions`))
        );
        //return this._currentSessions$;
  }

  // createLabsessions(session : LabSession) : Observable<boolean> {
  //   let url : string = `${this.apiHost}/lab_sessions`;
  //   let body = this.buildCreateLabsessionBodyFromSession (session);
  //   return this.httpClient.post<LabsessionResponseData>(url, body).pipe(
  //     tap(r => this.updateLabsessionsFromResponse(new LabsessionResponse(r["data"]))),
  //     map(r => true ),
  //     catchError(error => this.handleError(error))
  //   );
  // }
  //
  private createLabsessionsArray(objects: LabsessionResponse[]) : LabSession[]{
    let sessions = new Array<LabSession>();
     for(let obj in objects){
       sessions.push(this.buildCreateLabsessionFromJson(new LabsessionResponse(obj)));
     }
    return sessions;
  }


    private buildCreateLabsessionFromJson(s: LabsessionResponse ) : LabSession {
        let session = new LabSession(s.Description, s.StartDate, s.EndDate, new Course("CSCI","150","Web Design and Implementation","201801",(new User("professorlogin@test.com",
        "ryanmcfall-prof","Ryan", "McFall"))), s.Id);
        // session.description = s.Description;
        // session.start_date = s.StartDate;
        // session.end_date = s.EndDate;
        // session.id = s.Id
        // session.course = (new Course("CSCI","150","Web Design and Implementation","201801",(new User("professorlogin@test.com",
        // "ryanmcfall-prof","Ryan", "McFall","professors","cd11850c-4dbb-4e71-a6c3-e14ec69847ae","password"))));
        return session;
    }
  //
  //   private updateLabsessionsFromResponse(r : LabsessionResponse) {
  //       let session = new LabSession();
  //       session.Description = r.Description;
  //       session.Id = r.Id;
  //       this._currentSessions$.next(session);
  //
  //   }
   private handleCreateAccountError (error) : Observable<boolean> {
      if (error instanceof HttpErrorResponse) {
        let httpError = <HttpErrorResponse> error;
        let errorMessage : string = "The account was not created for the following reasons:";
        let reasons = error.error.errors.full_messages.join(", ");
        console.log(reasons);
      }
      return of(false);
    }

    // private handleError (error) : Observable<boolean> {
    //   return of(false);
    // }
    private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead


    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
