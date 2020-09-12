import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, throwError } from 'rxjs';
import {
  DetailInterface,
  PrimaryCompanyResponseInterface
} from './primary-company-details.model';
import { flatMap, tap } from 'rxjs/operators';
import { LocationService } from 'src/app/shared/services/location/location.service';
import {
  GlobalRegionInterface,
  CountryInterface,
  LocationInterface
} from 'src/app/shared/models/location.model';
import {
  exists,
  defaultTo,
  isIdParameterInvalid
} from 'src/app/shared/utils/basic-utils';
import { dataUri } from '@rxweb/reactive-form-validators';
import { DATA_CONTROLLER_PROCESSOR_MAP } from 'src/app/shared/models/controller-process.model';
import { BaseDomainInterface } from 'src/app/shared/models/base-domain-model';

declare const _: any;

@Injectable({
  providedIn: 'root'
})
export class PrimaryCompanyDetailsService {
  constructor(
    private httpClient: HttpClient,
    private locationService: LocationService
  ) {
    this.mapPrimaryEntityResponse = this.mapPrimaryEntityResponse.bind(this);
  }

  public getPrimaryEntity(id: string): Observable<DetailInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    const getDetailsCall = this.httpClient.get<PrimaryCompanyResponseInterface>(
      `/api/primary-entities/${id}/details`
    );

    const getLocationsCall = this.locationService.getFullCountryList();

    return forkJoin([getDetailsCall, getLocationsCall]).pipe(
      flatMap(this.mapPrimaryEntityResponse)
    );
  }

  public savePrimaryEntity(request: {
    id: string;
    notes: string;
    version: number;
  }): Observable<BaseDomainInterface> {
    if (isIdParameterInvalid(request.id)) {
      return throwError(`Invalid ID: ${request.id}`);
    }
    return this.httpClient.put<BaseDomainInterface>(
      `/api/primary-entities/${request.id}/details`,
      {
        id: request.id,
        notes: request.notes,
        version: request.version
      }
    );
  }

  private getCountryName(countryList: CountryInterface[], location) {
    const country = countryList.find(c => c.id === location.countryId);

    return exists(country) ? country.name : null;
  }

  private getStateOrProvinceName(countryList: CountryInterface[], location) {
    const country = countryList.find(c => c.id === location.countryId);

    if (!exists(country)) {
      return null;
    }

    const stateOrProvince = country.stateOrProvinces.find(
      sOrP => sOrP.id === location.stateOrProvinceId
    );

    return exists(stateOrProvince) ? stateOrProvince.name : null;
  }

  private mapPrimaryEntityResponse([details, locations]: [
    PrimaryCompanyResponseInterface,
    GlobalRegionInterface[]
  ]): Observable<DetailInterface> {
    const countries: CountryInterface[] = _.flatMap(locations, 'countries');

    const entityLocation = details.locations[0];
    let entityCountryName;
    let entityStateOrProvinceName;

    if (entityLocation) {
      entityCountryName = this.getCountryName(countries, entityLocation);

      entityStateOrProvinceName = this.getStateOrProvinceName(
        countries,
        entityLocation
      );
    }

    const contactLocation = details.contactResponse.location;
    let contactCountryName;
    let contactStateOrProvinceName;

    if (contactLocation) {
      contactCountryName = this.getCountryName(countries, contactLocation);

      contactStateOrProvinceName = this.getStateOrProvinceName(
        countries,
        contactLocation
      );
    }

    const businessStructure = details.businessStructureResponse
      ? details.businessStructureResponse.businessStructure
      : null;

    const industrySectors =
      details.industrySectors && details.industrySectors.length > 0
        ? details.industrySectors.map(sector => sector.name)
        : [];

    const result: DetailInterface = {
      companyName: defaultTo(null, details.name),
      entityType: businessStructure,
      country: entityCountryName,
      stateOrProvince: entityStateOrProvinceName,
      industrySectors: industrySectors,

      dataControllerOrProcessor:
        DATA_CONTROLLER_PROCESSOR_MAP[details.dataControllerOrProcessor].name,

      contact: {
        address: details.contactResponse.address,
        city: details.contactResponse.city,
        email: details.contactResponse.email,
        fullName: details.contactResponse.fullName,
        phone: details.contactResponse.phone,
        role: details.contactType ? details.contactType.type : undefined,
        country: contactCountryName,
        stateOrProvince: contactStateOrProvinceName,
        street: details.contactResponse['street'],
        zip: details.contactResponse.zip
      },

      entity: { id: details.id, version: details.version },
      notes: details.notes,
      companyProfileEditUrl: details.companyProfileEditUrl
    };

    return of(result);
  }
}
