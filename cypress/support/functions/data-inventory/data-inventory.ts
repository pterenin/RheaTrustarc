//
// https://docs.cypress.io/guides/guides/web-security.html#Disabling-Web-Security
// https://github.com/cypress-io/cypress/issues/944
//
export function createCompanyAffiliate(name: string) {
  // For Company Affiliate Type
  const cyConfigWaitDuration = Cypress.env('waitDuration');
  cy.wait(cyConfigWaitDuration);
  cy.get('#companyName').type(name);
  cy.get('ta-dropdown-field').each($el => {
    // Select last in each dropdown - minimal set of required fields
    // console.log($el);
    cy.wrap($el)
      .children()
      .last()
      .click()
      .within(el => {
        cy.wrap(el)
          .children()
          .last()
          .children()
          .last()
          .children()
          .last()
          .click();
      });
  });

  // Save Entity
  cy.get('button.ta-button.btn.btn-primary').click();
  cy.wait(cyConfigWaitDuration);
}

export function createThirdParty(name: string) {
  // Create Thrid Party
  const cyConfigWaitDuration = Cypress.env('waitDuration');
  cy.wait(cyConfigWaitDuration);
  cy.get('#vendorName').type(name);
  cy.get('ta-dropdown-field').each($el => {
    // Select last in each dropdown - minimal set of required fields
    // console.log($el);
    cy.wrap($el)
      .children()
      .last()
      .click()
      .within(el => {
        cy.wrap(el)
          .children()
          .last()
          .children()
          .last()
          .children()
          .last()
          .click();
      });
  });

  // Save Entity
  cy.get('button.ta-button.btn.btn-primary').click();
  cy.wait(cyConfigWaitDuration);
}

export function cloneEntityByName(name: string) {
  cy.server();
  cy.route('POST', '/api/search/base-records/*').as('postRequest');

  cy.wait('@postRequest');

  cy.get('ta-table-search')
    .type(name)
    .type('{enter}');

  cy.get('ta-table-row')
    .first()
    .get('ta-table-cell.ta-table-cell-tools')
    .eq(0)
    .click();

  cy.get('button')
    .contains('Clone')
    .click();

  cy.get('ta-clone-record-modal').contains('Clone Record');
  cy.get('ta-clone-record-modal ta-checkbox')
    .contains('All attachments')
    .click();
  cy.get('ta-clone-record-modal ta-checkbox')
    .contains('All tags')
    .click();
  cy.get('ta-clone-record-modal .ta-button.btn.btn-primary').click();
}

export function deleteEntityByName(name: string) {
  // cy.visit('data-inventory/my-inventory');
  const cyConfigWaitDuration = Cypress.env('waitDuration');
  // cy.wait(cyConfigWaitDuration);
  // console.log('delete entity by name');
  cy.get('.ta-table-body').within($body => {
    cy.get('.ta-table-row').each($row => {
      cy.wrap($row).within($$row => {
        cy.get('.data-inventory-name')
          .invoke('text')
          .then(text => {
            if (text.toString().trim() === name) {
              cy.get('ta-table-cell.ta-table-cell-tools').within($el => {
                cy.wrap($el)
                  .click()
                  .within($$el => {
                    cy.wrap($$el)
                      .children()
                      .first()
                      .children()
                      .last()
                      .children()
                      .children()
                      .last() // Select last, i.e. "Delete" (first is "Edit")
                      .click(); // Click delete button
                  });
              });
            }
          });
      });
    });
  });
  cy.wait(cyConfigWaitDuration);
  cy.get('ta-confirm-delete-content').contains('Confirm Delete');
  cy.get('ta-confirm-delete-content button.ta-button.btn.btn-primary').click();
}

// export function createEntityByTypeAndName(type: string, name: string) {
//   // For Third Party Type
//   if (type === 'third-party') {
//     cy.visit('data-inventory/my-inventory/third-party/new?action=Add');
//     cy.wait(cyConfigWaitDuration);
//     cy.get('#vendorName').type(name);
//     cy.get('ta-dropdown-field').each($el => {
//       // Select last in each dropdown - minimal set of required fields
//       console.log($el);
//       cy.wrap($el)
//         .children()
//         .last()
//         .click()
//         .within(el => {
//           cy.wrap(el)
//             .children()
//             .last()
//             .children()
//             .last()
//             .children()
//             .last()
//             .click();
//         });
//     });

//     // Save Entity
//     cy.get('button.ta-button.btn.btn-primary').click();
//     cy.wait(cyConfigWaitDuration);
//   } else if (type === 'company-affiliate') {
//     // For Company Affiliate Type
//     cy.visit('data-inventory/my-inventory/company-affiliate/new?action=Add');
//     cy.wait(cyConfigWaitDuration);
//     cy.get('#companyName').type(name);
//     cy.get('ta-dropdown-field').each($el => {
//       // Select last in each dropdown - minimal set of required fields
//       console.log($el);
//       cy.wrap($el)
//         .children()
//         .last()
//         .click()
//         .within(el => {
//           cy.wrap(el)
//             .children()
//             .last()
//             .children()
//             .last()
//             .children()
//             .last()
//             .click();
//         });
//     });

//     // Save Entity
//     cy.get('button.ta-button.btn.btn-primary').click();
//     cy.wait(cyConfigWaitDuration);
//   } else {
//     throw new Error('Unsupported entity type');
//   }
// }
