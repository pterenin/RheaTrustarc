import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessProcessWizardComponent } from './business-process-wizard.component';
import { SystemsSelectionComponent } from './systems-selection/systems-selection.component';
import { DetailsComponent } from './details/details.component';
import { AAA_NAV_LINK } from 'src/app/shared/components/header/header-aaa.constant';

const routes: Routes = [
  {
    path: '',
    component: BusinessProcessWizardComponent,
    children: [
      {
        path: 'details',
        component: DetailsComponent,
        data: {
          title: 'Details',
          header: false,
          showBreadCrumb: false
        }
      },
      {
        path: 'systems-selection',
        component: SystemsSelectionComponent,
        data: {
          title: 'Systems Selection',
          header: false,
          showBreadCrumb: false,
          checkReIndex: true,
          aaaNavLink: AAA_NAV_LINK.BUSINESS_PROCESS
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessProcessWizardRoutingModule {}
