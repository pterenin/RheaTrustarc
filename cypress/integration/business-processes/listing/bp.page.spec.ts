/// <reference types="cypress" />

context('RHEA - Business Processes', () => {
  before(() => {
    cy.loginAsAdministrator({ redirect: 'business-process' });
  });

  beforeEach(() => {
    cy.trustArcCookies();
  });

  it('should display business processes page', () => {
    cy.contains('All Business Processes');
  });

  // it('should display business processes', () => {
  //   cy.get('.ta-table-body ta-table-row')
  //     .first()
  //     .should('not.be.empty');
  //   cy.get('.ta-table-body ta-table-cell#ta-table-record-id')
  //     .first()
  //     .should('not.be.empty');
  //   cy.get('.ta-table-body ta-table-cell#ta-table-record-name a')
  //     .first()
  //     .should('not.be.empty');
  //   cy.get('.ta-table-body ta-table-cell#ta-table-record-type')
  //     .first()
  //     .should('not.be.empty');
  //   cy.get('.ta-table-body ta-table-cell#ta-table-record-owner')
  //     .first()
  //     .should('not.be.empty');
  //   cy.get('.ta-table-body ta-table-cell#ta-table-record-date')
  //     .first()
  //     .should('not.be.empty');
  //   cy.get('.ta-table-body ta-table-cell#ta-table-record-status')
  //     .first()
  //     .should('not.be.empty');
  //   cy.get('.ta-table-body ta-table-cell#ta-table-record-tools')
  //     .first()
  //     .should('not.be.empty');
  // });

  it('should be searchable', () => {
    cy.get('ta-table-search input')
      .type('UNTITLED')
      .type('{enter}');
  });

  it('should navigate to `view business process` from context menu', () => {
    cy.wait(1000);
    cy.get('#dropdownBasic0').click();
    cy.get('button.dropdown-item').then(btn => {
      if (btn.text().indexOf('View') > -1) {
        cy.get('button.dropdown-item')
          .contains('View')
          .click();
        cy.contains('Description');
        cy.contains('Assessments');
        cy.contains('Activity Log');
      }
    });
  });

  it('should go back to business processes list page after viewing business process', () => {
    cy.get('a[href="/"]')
      .first()
      .click();
    cy.contains('h2', 'All Business Processes');
  });

  it('should expand context menu and have list options', () => {
    cy.get('ta-datagrid-add-bp-button button.dropdown-toggle')
      .first()
      .click();
    cy.get('button.dropdown-item').contains('New Business Process');
    cy.get('button.dropdown-item').contains('Assign New Business Process');
    cy.get('ta-datagrid-add-bp-button button.dropdown-toggle')
      .first()
      .click();
  });

  it('should navigate to `new business process` from context menu', () => {
    cy.get('ta-datagrid-add-bp-button button.dropdown-toggle')
      .first()
      .click();
    cy.get('button.dropdown-item')
      .contains('New Business Process')
      .click();
    cy.contains('Name of business process*');
  });

  it('should go back to business processes list page after opening new business process works', () => {
    cy.get('button[routerlink="/business-process"]').click();
    cy.contains('h2', 'All Business Processes');
  });
  // it('should select a business process and check context menu for action icons and select delete from context menu', () => {
  //   cy.get('ta-table-row .ta-checkbox-lb')
  //     .first()
  //     .click();
  //   cy.get('button ta-icon[icon=edit]');
  //   cy.get('button ta-icon[icon=download]');
  //   cy.get('button ta-icon[icon=delete]').click();
  //   cy.contains('Confirm Delete');
  //   cy.get('button.close')
  //     .first()
  //     .click();
  //   cy.get('ta-table-row .ta-checkbox-lb')
  //     .first()
  //     .click();
  // });

  it('should open and close `assign new business process` modal from context menu', () => {
    cy.get('ta-datagrid-add-bp-button button.dropdown-toggle')
      .first()
      .click();
    cy.get('button.dropdown-item')
      .contains('Assign New Business Process')
      .click();
    cy.contains('Assign New Business Process');
    cy.get('button.btn-secondary')
      .contains('Cancel')
      .click();
  });

  it('should select a business process and check context menu for action icons', () => {
    cy.get('#record-datagrid-icon-edit').should('be.disabled');
    cy.get('#record-datagrid-icon-download').should('be.disabled');
    cy.get('#record-datagrid-icon-delete').should('be.disabled');

    cy.get('#business-process-0 ta-checkbox').click();

    cy.get('#record-datagrid-icon-edit').should('be.visible');
    cy.get('#record-datagrid-icon-download').should('be.visible');
    cy.get('#record-datagrid-icon-delete').should('be.visible');
  });

  // it('should select a business process and select delete from context menu', () => {
  //   cy.get('#record-datagrid-icon-delete').click();
  //   cy.contains('Confirm Delete');

  //   cy.get('button.close')
  //     .eq(0)
  //     .click();
  // });
});
