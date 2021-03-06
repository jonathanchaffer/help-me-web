import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SessionViewComponent } from './components/session-view/session-view.component';

import { LoggedinGuard } from './auth/loggedin.guard';

const routes : Routes = [
	{
		path: '',
		canActivate: [LoggedinGuard],
		children: [
			{
				path: '',
				canActivateChild: [LoggedinGuard],
				children: [
				  {
				    'path': 'dashboard',
				    'component': DashboardComponent
				  },
					{
						'path': 'login',
						'component': LoginComponent
					},
				  {
				    'path':'lab_sessions/:id',
				    'component': SessionViewComponent
				  },
				  {
				    'path': '',
				    'component': HomeComponent
				  },
					{
						'path': 'users',
						loadChildren: () => import('./user-management/user-management.module').then( mod => mod.UserManagementModule)
					}
				]
			}
		]
	}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]

})
export class HelpmeRoutingModule { }
