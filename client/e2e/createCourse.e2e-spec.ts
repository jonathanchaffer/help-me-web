import { CreateCourse } from './createCourse.po';
import { browser } from 'protractor';
import { StartSessionComponent } from './components/start-session.component';
import { CreateCourseFormComponent } from './components/create-course-component.component'

describe('create course modal opens', function () {
  let page: CreateCourse;

  beforeEach(() => {
    page = new CreateCourse();
  });

  it('should open modal', () => {
    page.navigateTo();
    page.getEmailTextbox().sendKeys('prof@test.com');
    page.getPasswordTextbox().sendKeys('password');
    page.getSubmitButton().click();

    //page.navigateTo2();
    //page.getStartSession().getCreateCourseButton().click)()
    page.getCreateCourseButton().click();

    expect(page.getOpenModalElement()).toBeTruthy();
    expect(page.getOpenModalFormElement()).toBeTruthy();
  });
});
