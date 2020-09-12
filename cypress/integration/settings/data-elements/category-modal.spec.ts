/// <reference types="Cypress" />
import { utilGenerateUUID } from '../../../support/functions/utilities';
import {
  toolbarAliases,
  toolbarClickAddCategory,
  toolbarClickDelete
} from '../../../support/functions/settings/data-elements/category-listing-toolbar-actions';

context('RHEA>Settings>Data Elements>Category CRUD', () => {
  const cyConfigWaitDuration = Cypress.env('waitDuration');

  const modalCyAddNewCustomCategory = {
    modalSelector: 'ta-custom-category-modal',
    fields: {
      categoryName: '[data-cy="category"]'
    }
  };
  const customCategoryName = `_e2e-custom-category-${utilGenerateUUID()}`;

  const modalCyDeleteCustomCategory = {
    modalSelector: 'ta-confirm-delete-content',
    fields: {
      categoryName: '[data-cy="category"]'
    }
  };

  before(() => {
    // Login and redirect to target page
    cy.loginAsAdministrator({
      redirect: 'settings/data-elements/categories'
    });
  });

  beforeEach(() => {
    cy.trustArcCookies();
    toolbarAliases();
  });

  //#region Add New Custom Category

  it(`Modal- add new Category - open modal, Verify 'Title', 'cancel, close
      and save' buttons exist and close/cancel is working`, () => {
    toolbarClickAddCategory();

    cy.modalVerification(modalCyAddNewCustomCategory.modalSelector, false);
    cy.modalCloseByIconButton(modalCyAddNewCustomCategory.modalSelector);

    toolbarClickAddCategory();
    cy.modalCloseByCancelButton(modalCyAddNewCustomCategory.modalSelector);
  });

  function addNewCategory(categoryName: string) {
    // open modal
    toolbarClickAddCategory();

    // input field should be empty
    cy.get(`${modalCyAddNewCustomCategory.fields.categoryName}`).should(
      'be.empty'
    );

    // Type text
    cy.modalTypeText(
      modalCyAddNewCustomCategory.modalSelector,
      modalCyAddNewCustomCategory.fields.categoryName,
      categoryName
    );

    // save button should be enabled on entered text
    cy.modalClickSubmit(modalCyAddNewCustomCategory.modalSelector);

    cy.wait(cyConfigWaitDuration);

    cy.isRecordExistByName('[data-cy="category-name"]', customCategoryName);
  }

  it(`Modal- add new Category - create new record ${customCategoryName}  and verify it is showing in list`, () => {
    addNewCategory(customCategoryName);
  });

  //#endregion

  //#region Delete Custom Category
  it(`Modal- delete custom Category - open modal, Verify 'Title',
      'cancel, close and delete' button exist and close/cancel is working`, () => {
    // selects previously created record
    cy.selectRecordByName(
      '[data-cy=category-name]',
      customCategoryName,
      'categories-record'
    );

    // open delete modal
    toolbarClickDelete();

    cy.modalDeleteVerification(modalCyDeleteCustomCategory.modalSelector);
    cy.modalCloseByIconButton(modalCyDeleteCustomCategory.modalSelector);

    toolbarClickDelete();
    cy.modalCloseByCancelButton(modalCyDeleteCustomCategory.modalSelector);
  });

  it(`Modal- delete custom Category - delete record ${customCategoryName}`, () => {
    // open delete modal
    toolbarClickDelete();
    cy.modalClickSubmit(modalCyDeleteCustomCategory.modalSelector);
  });

  //#endregion
});
