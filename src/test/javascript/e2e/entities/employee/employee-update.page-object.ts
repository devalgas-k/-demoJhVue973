import { by, element, ElementFinder } from 'protractor';

import AlertPage from '../../page-objects/alert-page';

export default class EmployeeUpdatePage extends AlertPage {
  title: ElementFinder = element(by.id('demoJhVue973App.employee.home.createOrEditLabel'));
  footer: ElementFinder = element(by.id('footer'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));

  firstNameInput: ElementFinder = element(by.css('input#employee-firstName'));

  lastNameInput: ElementFinder = element(by.css('input#employee-lastName'));

  emailInput: ElementFinder = element(by.css('input#employee-email'));

  phoneNumberInput: ElementFinder = element(by.css('input#employee-phoneNumber'));

  hireDateInput: ElementFinder = element(by.css('input#employee-hireDate'));

  salaryInput: ElementFinder = element(by.css('input#employee-salary'));

  commissionPctInput: ElementFinder = element(by.css('input#employee-commissionPct'));

  levelInput: ElementFinder = element(by.css('input#employee-level'));

  contractSelect = element(by.css('select#employee-contract'));

  cvInput: ElementFinder = element(by.css('input#file_cv'));

  managerSelect = element(by.css('select#employee-manager'));

  departmentSelect = element(by.css('select#employee-department'));
}
