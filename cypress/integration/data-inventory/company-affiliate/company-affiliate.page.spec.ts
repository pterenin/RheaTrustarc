/// <reference types="cypress" />

import { utilGenerateUUID } from '../../../support/functions/utilities';

context('RHEA - Data Inventory - Company Affiliate', () => {
  const CONFIGURATION = Cypress.env('optional').dataInventory.ItSystems;

  const redirectsDataInventory = {
    listing: 'data-inventory/my-inventory',
    addNewCompanyAffiliate:
      'data-inventory/my-inventory/company-affiliate/new?action=Add'
  };
  let redirectListing = false;
  before(() => {
    cy.loginAsAdministrator({
      redirect: redirectListing
        ? redirectsDataInventory.listing
        : redirectsDataInventory.addNewCompanyAffiliate
    });
  });

  beforeEach(() => {
    cy.trustArcCookies();
  });

  it('should display data inventory page', () => {
    cy.contains('Company Affiliate');
  });

  it('should display warning "One or more fields need attention" if fields are blank', () => {
    cy.contains('One or more fields need attention');
  });

  it('should display error if name is empty and form is dirty', () => {
    cy.get('#companyName')
      .type('Company Affiliate 1')
      .clear();
    cy.get('#notes').click();
    cy.contains('This field is required.');
  });

  const recordName = `${CONFIGURATION.recordPrefix}${'Company Affiliate'}`;

  // Test creation of Company Affiliate and deletion
  it(`should fill fields and create record ${recordName}`, () => {
    cy.createCompanyAffiliate(recordName);
    redirectListing = true;
  });

  it(`should clone record ${recordName}`, () => {
    cy.cloneEntityByName(recordName);
  });

  it(`should delete record ${recordName}`, () => {
    cy.deleteEntityByName(recordName);
  });
});
