/* tslint:disable no-unused-expression */
import { browser } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import LocationComponentsPage, { LocationDeleteDialog } from './location.page-object';
import LocationUpdatePage from './location-update.page-object';
import LocationDetailsPage from './location-details.page-object';

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

const expect = chai.expect;

describe('Location e2e test', () => {
  let navBarPage: NavBarPage;
  let updatePage: LocationUpdatePage;
  let detailsPage: LocationDetailsPage;
  let listPage: LocationComponentsPage;
  let deleteDialog: LocationDeleteDialog;
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

  it('should load Locations', async () => {
    await navBarPage.getEntityPage('location');
    listPage = new LocationComponentsPage();

    await waitUntilAllDisplayed([listPage.title, listPage.footer]);

    expect(await listPage.title.getText()).not.to.be.empty;
    expect(await listPage.createButton.isEnabled()).to.be.true;

    await waitUntilAnyDisplayed([listPage.noRecords, listPage.table]);
    beforeRecordsCount = (await isVisible(listPage.noRecords)) ? 0 : await getRecordsCount(listPage.table);
  });
  describe('Create flow', () => {
    it('should load create Location page', async () => {
      await listPage.createButton.click();
      updatePage = new LocationUpdatePage();

      await waitUntilAllDisplayed([updatePage.title, updatePage.footer, updatePage.saveButton]);

      expect(await updatePage.title.getAttribute('id')).to.match(/demoJhVue973App.location.home.createOrEditLabel/);
    });

    it('should create and save Locations', async () => {
      await updatePage.streetAddressInput.sendKeys('streetAddress');

      await updatePage.postalCodeInput.sendKeys('postalCode');

      await updatePage.cityInput.sendKeys('city');

      await updatePage.stateProvinceInput.sendKeys('stateProvince');

      // await selectLastOption(updatePage.countrySelect);

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

        deleteDialog = new LocationDeleteDialog();
        await waitUntilDisplayed(deleteDialog.dialog);

        expect(await deleteDialog.title.getAttribute('id')).to.match(/demoJhVue973App.location.delete.question/);

        await click(deleteDialog.confirmButton);
        await waitUntilHidden(deleteDialog.dialog);

        expect(await isVisible(deleteDialog.dialog)).to.be.false;

        await waitUntilCount(listPage.records, beforeRecordsCount);
        expect(await listPage.records.count()).to.eq(beforeRecordsCount);
      });

      it('should load details Location page and fetch data', async () => {
        const detailsButton = listPage.getDetailsButton(listPage.records.first());
        await click(detailsButton);

        detailsPage = new LocationDetailsPage();

        await waitUntilAllDisplayed([detailsPage.title, detailsPage.backButton, detailsPage.firstDetail]);

        expect(await detailsPage.title.getText()).not.to.be.empty;
        expect(await detailsPage.firstDetail.getText()).not.to.be.empty;

        await click(detailsPage.backButton);
        await waitUntilCount(listPage.records, beforeRecordsCount + 1);
      });

      it('should load edit Location page, fetch data and update', async () => {
        const editButton = listPage.getEditButton(listPage.records.first());
        await click(editButton);

        await waitUntilAllDisplayed([updatePage.title, updatePage.footer, updatePage.saveButton]);

        expect(await updatePage.title.getText()).not.to.be.empty;

        await updatePage.streetAddressInput.clear();
        await updatePage.streetAddressInput.sendKeys('modified');

        await updatePage.postalCodeInput.clear();
        await updatePage.postalCodeInput.sendKeys('modified');

        await updatePage.cityInput.clear();
        await updatePage.cityInput.sendKeys('modified');

        await updatePage.stateProvinceInput.clear();
        await updatePage.stateProvinceInput.sendKeys('modified');

        await updatePage.saveButton.click();

        await waitUntilHidden(updatePage.saveButton);

        expect(await isVisible(updatePage.saveButton)).to.be.false;
        await waitUntilCount(listPage.records, beforeRecordsCount + 1);
      });
    });
  });
});
