import * as Utilities from '../../support/functions/utilities';
import {
  ApiAccessToken,
  ApplicationFeaturesEnum
} from '../../support/functions/shared';

// tslint:disable: no-unused-expression

context('RHEA Licenses> Enable/Disable Licenses', () => {
  //#region Hooks

  before(() => {
    cy.getAAAPlutusToken();
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  after(() => {});

  //#endregion

  //#region Rhea License Step 4, 3

  it('RHEA-License> disable RHEA_NEW_UI_STEPS_34_LICENSE in PLUTUS', () => {
    cy.getAAAPlutusToken().then(() => {
      const token = Cypress.env('oauth.rhea.token') as ApiAccessToken;
      cy.updateByApiFeatureStatus(
        token.accountId,
        ApplicationFeaturesEnum.RHEA_NEW_UI_STEPS_34_LICENSE,
        false
      );
    });
  });

  it('RHEA-License> enable RHEA_NEW_UI_STEPS_34_LICENSE in PLUTUS', () => {
    cy.getAAAPlutusToken().then(() => {
      const token = Cypress.env('oauth.rhea.token') as ApiAccessToken;
      cy.updateByApiFeatureStatus(
        token.accountId,
        ApplicationFeaturesEnum.RHEA_NEW_UI_STEPS_34_LICENSE,
        true
      );
    });
  });

  //#endregion

  //#region Rhea License Step 1, 2

  // license RHEA_NEW_UI_STEPS_12_LICENSE enables new consolidated details page
  // which replaces background and owners page in old UI

  it('RHEA-License> enable RHEA_NEW_UI_STEPS_12_LICENSE in PLUTUS', () => {
    cy.getAAAPlutusToken().then(() => {
      const token = Cypress.env('oauth.rhea.token') as ApiAccessToken;
      cy.updateByApiFeatureStatus(
        token.accountId,
        ApplicationFeaturesEnum.RHEA_NEW_UI_STEPS_12_LICENSE,
        true
      );
    });
  });

  it('RHEA-License> RHEA_NEW_UI_STEPS_12_LICENSE should be enabled', () => {
    cy.getAAARheaToken().then(() => {
      const token = Cypress.env('oauth.rhea.token') as ApiAccessToken;
      cy.getByApiApplicationFeaturesStatus().then(features => {
        expect(features.RHEA_NEW_UI_STEPS_12_LICENSE).to.not.be.undefined;
        expect(features.RHEA_NEW_UI_STEPS_12_LICENSE).to.be.true;
      });
    });
  });

  it('RHEA-License> disable RHEA_NEW_UI_STEPS_12_LICENSE in PLUTUS', () => {
    cy.getAAAPlutusToken().then(() => {
      const token = Cypress.env('oauth.rhea.token') as ApiAccessToken;
      cy.updateByApiFeatureStatus(
        token.accountId,
        ApplicationFeaturesEnum.RHEA_NEW_UI_STEPS_12_LICENSE,
        false
      );
    });
  });

  it('RHEA-License> RHEA_NEW_UI_STEPS_12_LICENSE should be disabled', () => {
    cy.getAAARheaToken().then(() => {
      const token = Cypress.env('oauth.rhea.token') as ApiAccessToken;
      cy.getByApiApplicationFeaturesStatus().then(features => {
        expect(features.RHEA_NEW_UI_STEPS_12_LICENSE).to.not.be.undefined;
        expect(features.RHEA_NEW_UI_STEPS_12_LICENSE).to.be.false;
      });
    });
  });

  //#endregion
});
