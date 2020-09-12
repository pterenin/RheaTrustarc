import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeftNavComponent } from './shared/components/left-nav/left-nav.component';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  UrlTree
} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TaBreadcrumbModule, TaToastModule } from '@trustarc/ui-toolkit';
import { HeaderService } from './shared/components/header/header.service';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoleControllerService } from './shared/services/user-role-controller/user-role-controller.service';
import { of } from 'rxjs';
import { FooterModule } from './shared/components/footer/footer.module';
import { FeatureFlagService } from './shared/services/feature-flag/feature-flag.service';
import { AdminControllerService } from './shared/_services/rest-api';

const routerStub = {
  // Router
  events: of(new NavigationEnd(0, '/', '/test')),
  createUrlTree: (commands, navExtras = {}) => {},
  serializeUrl: (url: UrlTree) => '',
  navigate: jasmine.createSpy('navigate')
};

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TaBreadcrumbModule,
        TaToastModule,
        FooterModule,
        TranslateModule.forRoot()
      ],
      declarations: [AppComponent, HeaderComponent, LeftNavComponent],
      providers: [
        { provide: Router, useValue: routerStub },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              children: [{ path: '', data: { breadcrumb: 'test' } }]
            },
            firstChild: {
              outlet: 'primary',
              data: of({
                title: 'Settings',
                breadcrumb: 'Settings',
                showLeftNav: true,
                leftNavType: 'SETTINGS',
                showBreadCrumb: true,
                footer: true,
                header: true
              })
            }
          }
        },
        UserRoleControllerService,
        AdminControllerService
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));
});
