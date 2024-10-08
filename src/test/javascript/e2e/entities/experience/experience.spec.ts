/* tslint:disable no-unused-expression */
import { browser } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import ExperienceComponentsPage, { ExperienceDeleteDialog } from './experience.page-object';
import ExperienceUpdatePage from './experience-update.page-object';
import ExperienceDetailsPage from './experience-details.page-object';

import {
  clear,
  click,
  getRecordsCount,
  isVisible,
  selectLastOption,
  waitUntilAllDisplayed,
  waitUntilAnyDisplayed,
  waitUntilCount,
  waitUntilDisplayed,
  waitUntilHidden,
} from '../../util/utils';

import path from 'path';

const expect = chai.expect;

describe('Experience e2e test', () => {
  let navBarPage: NavBarPage;
  let updatePage: ExperienceUpdatePage;
  let detailsPage: ExperienceDetailsPage;
  let listPage: ExperienceComponentsPage;
  let deleteDialog: ExperienceDeleteDialog;
  const fileToUpload = '../../../../../main/webapp/content/images/logo-jhipster.png';
  const absolutePath = path.resolve(__dirname, fileToUpload);
  let beforeRecordsCount = 0;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    await navBarPage.login(username, password);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });

  it('should load Experiences', async () => {
    await navBarPage.getEntityPage('experience');
    listPage = new ExperienceComponentsPage();

    await waitUntilAllDisplayed([listPage.title, listPage.footer]);

    expect(await listPage.title.getText()).not.to.be.empty;
    expect(await listPage.createButton.isEnabled()).to.be.true;

    await waitUntilAnyDisplayed([listPage.noRecords, listPage.table]);
    beforeRecordsCount = (await isVisible(listPage.noRecords)) ? 0 : await getRecordsCount(listPage.table);
  });
  describe('Create flow', () => {
    it('should load create Experience page', async () => {
      await listPage.createButton.click();
      updatePage = new ExperienceUpdatePage();

      await waitUntilAllDisplayed([updatePage.title, updatePage.footer, updatePage.saveButton]);

      expect(await updatePage.title.getAttribute('id')).to.match(/demoJhVue973App.experience.home.createOrEditLabel/);
    });

    it('should create and save Experiences', async () => {
      await updatePage.titleInput.sendKeys('Ef');

      await updatePage.companyInput.sendKeys('IIY~Um');

      await waitUntilDisplayed(updatePage.descriptionInput);
      await updatePage.descriptionInput.sendKeys('description');

      await waitUntilDisplayed(updatePage.logoCompanyInput);
      await updatePage.logoCompanyInput.sendKeys(absolutePath);

      await updatePage.inProgressInput.click();

      await selectLastOption(updatePage.contractSelect);

      await updatePage.startDateInput.sendKeys('2001-01-01');

      await updatePage.endDateInput.sendKeys('2001-01-01');

      // await selectLastOption(updatePage.expertiseSelect);

      expect(await updatePage.saveButton.isEnabled()).to.be.true;
      await updatePage.saveButton.click();

      await waitUntilHidden(updatePage.saveButton);
      expect(await isVisible(updatePage.saveButton)).to.be.false;

      await waitUntilCount(listPage.records, beforeRecordsCount + 1);
      expect(await listPage.records.count()).to.eq(beforeRecordsCount + 1);
    });

    describe('Details, Update, Delete flow', () => {
      after(async () => {
        const deleteButton = listPage.getDeleteButton(listPage.records.first());
        await click(deleteButton);

        deleteDialog = new ExperienceDeleteDialog();
        await waitUntilDisplayed(deleteDialog.dialog);

        expect(await deleteDialog.title.getAttribute('id')).to.match(/demoJhVue973App.experience.delete.question/);

        await click(deleteDialog.confirmButton);
        await waitUntilHidden(deleteDialog.dialog);

        expect(await isVisible(deleteDialog.dialog)).to.be.false;

        await waitUntilCount(listPage.records, beforeRecordsCount);
        expect(await listPage.records.count()).to.eq(beforeRecordsCount);
      });

      it('should load details Experience page and fetch data', async () => {
        const detailsButton = listPage.getDetailsButton(listPage.records.first());
        await click(detailsButton);

        detailsPage = new ExperienceDetailsPage();

        await waitUntilAllDisplayed([detailsPage.title, detailsPage.backButton, detailsPage.firstDetail]);

        expect(await detailsPage.title.getText()).not.to.be.empty;
        expect(await detailsPage.firstDetail.getText()).not.to.be.empty;

        await click(detailsPage.backButton);
        await waitUntilCount(listPage.records, beforeRecordsCount + 1);
      });

      it('should load edit Experience page, fetch data and update', async () => {
        const editButton = listPage.getEditButton(listPage.records.first());
        await click(editButton);

        await waitUntilAllDisplayed([updatePage.title, updatePage.footer, updatePage.saveButton]);

        expect(await updatePage.title.getText()).not.to.be.empty;

        await updatePage.titleInput.clear();
        await updatePage.titleInput.sendKeys('P(S');

        await updatePage.companyInput.clear();
        await updatePage.companyInput.sendKeys('P');

        await updatePage.descriptionInput.clear();
        await updatePage.descriptionInput.sendKeys('updateddescription');

        await updatePage.inProgressInput.click();

        await updatePage.startDateInput.clear();
        await updatePage.startDateInput.sendKeys('2019-01-01');

        await updatePage.endDateInput.clear();
        await updatePage.endDateInput.sendKeys('2019-01-01');

        await updatePage.saveButton.click();

        await waitUntilHidden(updatePage.saveButton);

        expect(await isVisible(updatePage.saveButton)).to.be.false;
        await waitUntilCount(listPage.records, beforeRecordsCount + 1);
      });
    });
  });
});
