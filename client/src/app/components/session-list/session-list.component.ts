import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

import { LabSessionService } from '../../services/labsession.service';
import { UserService } from '../../services/user.service';
import { RoutingHelperService } from '../../services/routing-helper.service';
import { AudioService } from '../../services/audio.service';
import { LabSession } from '../../models/lab_session.model';
import { Course } from '../../models/course.model';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'app-session-list',
	templateUrl: './session-list.component.html',
	styleUrls: ['./session-list.component.scss']
})
export class SessionListComponent implements OnInit {

	@Input() private sessions: LabSession[]; //list of all labsessions
	@Input() private label: string = "Showing Matching Sessions";
	@Input() public isCollapsed: boolean = true;
	private searchText: string; //what the search uses to find mathcing sessions
	private copied: boolean = false;
	private editingDescriptions = new Map<LabSession,boolean>();
	private tempDescriptions = new Map<LabSession,string>();

	constructor(@Inject(DOCUMENT) public document: Document, private router: Router,
		private audioService: AudioService, private routingHelperService: RoutingHelperService,
		private labSessionService: LabSessionService, private userService: UserService) { }

	ngOnInit() {
	}

	//copy the session token to the clipboard
	copySessionCode(s: LabSession) {
		this.copied = true;
		let selBox = this.document.createElement('textarea');
		selBox.value = s.token;
		this.document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		this.document.execCommand('copy');
		this.document.body.removeChild(selBox);
	}

	//copy the session url to the clipboard
	copySessionLink(s: LabSession) {
		this.copied = true;
		let selBox = this.document.createElement('textarea');
		let url = this.routingHelperService.qrCodeDestinationForSession(s);
		selBox.value = url; ///////NEED TO CHANGE THIS TO URL TO GO TO SESSION
		this.document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		this.document.execCommand('copy');
		this.document.body.removeChild(selBox);
	}

	//goes to the labsession url
	viewSession(s: LabSession) {
		this.router.navigateByUrl(`/lab_sessions/${s.id}`);
	}

	//filters the list of labsessions using the search text
	filter(): boolean {
		if (this.searchText != undefined && this.searchText != "") {
			return true;
		}
		else {
			return false;
		}
	}

	//the number of sessions in the list
	sessionsLength(): number {
		if (this.sessions == undefined) {
			return 0;
		}
		else {
			return this.sessions.length;
		}
	}

	//is the list collapsed?
	checkIfCollapsed(): string {
		if (this.isCollapsed) {
			return "Open";
		}
		else {
			return "Close"
		}
	}

	beginEditDescription(s: LabSession) {
		this.tempDescriptions.set(s,s.description);
		this.editingDescriptions.set(s,true);
	}

	cancelEditDescription(s: LabSession) {
		this.editingDescriptions.set(s,false);
		s.description = this.tempDescriptions.get(s);
	}
	
	saveEditDescription(s: LabSession) {
		this.labSessionService.updateDescription(s.id, s.description).subscribe();
		this.editingDescriptions.set(s,false);
	}

	editingDescription(s: LabSession): boolean {
		let res = this.editingDescriptions.get(s);
		if (res != null) return res;
		else return false;
	}

	get courses(): Course[] {
		var courseIds = new Set<string>();
		var courses: Course[] = [];
		for (let session of this.sessions) {
			if (!courseIds.has(session.course.id)) {
				courseIds.add(session.course.id);
				courses.push(session.course);
			}
		}
		return courses;
	}

	getSessionsForCourse(courseId: string): LabSession[] {
		var sessions: LabSession[] = [];
		for (let session of this.sessions) {
			if (session.course.id === courseId) {
				sessions.push(session);
			}
		}
		return sessions;
	} 

}
