import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationComponent } from './location.component';
import { FormsModule } from '@angular/forms';
import {
  TaAccordionModule,
  TaButtonsModule,
  TaCheckboxModule,
  TaSvgIconModule,
  TaTabsetModule
} from '@trustarc/ui-toolkit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { SearchFieldModule } from '../../_components/search-field/search-field.module';

const LocationData = [
  {
    name: 'Asia',
    countries: [
      {
        name: 'India',
        twoLetterCode: 'IN',
        selected: true,
        threeLetterCode: 'IND'
      },
      {
        name: 'China',
        twoLetterCode: 'CN',
        selected: false,
        threeLetterCode: 'CHN'
      },
      {
        name: 'Sri Lanka',
        twoLetterCode: 'LK',
        selected: false,
        threeLetterCode: 'LKA'
      },
      {
        name: 'Vietnam',
        twoLetterCode: 'VN',
        selected: false,
        threeLetterCode: 'VNM'
      },
      {
        name: 'Cambodia',
        twoLetterCode: 'KH',
        selected: false,
        threeLetterCode: 'KHM'
      },
      {
        name: 'Nepal',
        twoLetterCode: 'NP',
        selected: false,
        threeLetterCode: 'NPL'
      },
      {
        name: 'Laos',
        twoLetterCode: 'LA',
        selected: false,
        threeLetterCode: 'LAO'
      },
      {
        name: 'Qatar',
        twoLetterCode: 'QA',
        selected: false,
        threeLetterCode: 'QAT'
      }
    ]
  },
  {
    name: 'Europe',
    countries: [
      {
        name: 'Germany',
        twoLetterCode: 'DE',
        selected: true,
        threeLetterCode: 'DEU'
      },
      {
        name: 'France',
        twoLetterCode: 'FR',
        selected: true,
        threeLetterCode: 'FRA'
      },
      {
        name: 'Italy',
        twoLetterCode: 'IT',
        selected: true,
        threeLetterCode: 'ITA'
      },
      {
        name: 'United Kingdom',
        twoLetterCode: 'GB',
        selected: true,
        threeLetterCode: 'GBR'
      },
      {
        name: 'Poland',
        twoLetterCode: 'PL',
        selected: false,
        threeLetterCode: 'POL'
      },
      {
        name: 'Finland',
        twoLetterCode: 'FI',
        selected: false,
        threeLetterCode: 'FIN'
      }
    ]
  }
];

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LocationComponent],
      imports: [
        FormsModule,
        TaAccordionModule,
        TaTabsetModule,
        TaCheckboxModule,
        TaSvgIconModule,
        TaButtonsModule,
        SearchFieldModule,
        HttpClientTestingModule
      ],
      providers: [HttpClient]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    component.locationData = LocationData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#getSelectedItemCount() with null index should return zero', () => {
    expect(component.getSelectedItemCount(null) === 0);
  });

  it('#getSelectedItemCount() with undefined index should return zero', () => {
    expect(component.getSelectedItemCount(undefined) === 0);
  });

  it('#getSelectedItemCount() with index zero(Asia) should return one', () => {
    expect(component.getSelectedItemCount(0) === 1);
  });

  it('#isAllSelected() with null index should return false', () => {
    expect(component.isAllSelected(null) === false);
  });

  it('#isAllSelected() with undefined index should return false', () => {
    expect(component.isAllSelected(undefined) === false);
  });

  it('#isAllSelected() with index of zero(Asia) should return false', () => {
    expect(component.isAllSelected(0) === false);
  });

  it('#isAllSelected() with index of one(Europe) should return false', () => {
    expect(component.isAllSelected(1) === false);
  });

  it('#checkAllCountriesForRegion(null, null) should not change the number of selected countries', () => {
    const countSelectedAsianCountries = component.getSelectedItemCount(0);
    const countSelectedEuropeanCountries = component.getSelectedItemCount(1);

    component.checkAllCountriesForRegion(null, null);

    expect(component.getSelectedItemCount(0) === countSelectedAsianCountries);
    expect(
      component.getSelectedItemCount(0) === countSelectedEuropeanCountries
    );
  });

  it('#checkAllCountriesForRegion(null, undefined) should not change the number of selected countries', () => {
    const countSelectedAsianCountries = component.getSelectedItemCount(0);
    const countSelectedEuropeanCountries = component.getSelectedItemCount(1);

    component.checkAllCountriesForRegion(null, undefined);

    expect(component.getSelectedItemCount(0) === countSelectedAsianCountries);
    expect(
      component.getSelectedItemCount(0) === countSelectedEuropeanCountries
    );
  });

  it('#checkAllCountriesForRegion(null, 0) should select all Asian countries', () => {
    component.checkAllCountriesForRegion(null, 0);

    expect(
      component.getSelectedItemCount(0) ===
        component.locationData[0].countries.length
    );
  });
});
