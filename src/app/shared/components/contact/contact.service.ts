import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountryInterface } from '../../models/location.model';
import { Observable, Subject, throwError } from 'rxjs';
import {
  Contact,
  ContactIdResponse,
  ContactInterface,
  ContactTypeInterface
} from './contact.model';
import { map } from 'rxjs/operators';
import { isIdParameterInvalid } from 'src/app/shared/utils/basic-utils';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  public countries: CountryInterface[];
  public contactDetails: ContactInterface;
  public contactSubject = new Subject<ContactInterface>();

  constructor(private httpClient: HttpClient) {}

  public getCountries(): Observable<CountryInterface[]> {
    return this.httpClient
      .get<CountryInterface[]>(`/api/locations/countries`)
      .pipe(map(countries => (this.countries = countries)));
  }

  public getContactTypes(): Observable<ContactTypeInterface[]> {
    return this.httpClient.get<ContactTypeInterface[]>(
      `/api/contact-types/company-entity-use`
    );
  }

  public postNewContact(contact: ContactInterface): Observable<any> {
    return this.httpClient.post('/api/contacts', contact);
  }

  public getContactById(id: string): Observable<ContactInterface> {
    if (isIdParameterInvalid(id)) {
      return throwError(`Invalid ID: ${id}`);
    }
    return this.httpClient.get<ContactInterface>(`/api/contacts/${id}`);
  }

  public updateContactById(
    id: string,
    contactRequest: ContactInterface
  ): Observable<ContactIdResponse> {
    return this.httpClient.put<ContactIdResponse>(
      `/api/contacts/${id}`,
      contactRequest
    );
  }

  public mapToContactInterface(
    response: any,
    contact: ContactInterface
  ): Contact {
    const modalContact: Contact = {
      fullName: response.fullName,
      email: response.email,
      phone: response.phone,
      address: response.address,
      city: response.city,
      zip: response.zip,
      location: response.country
        ? {
            countryId: response.country ? response.country.id : null,
            stateOrProvinceId: response.stateOrProvince
              ? response.stateOrProvince.id
              : null,
            globalRegionId:
              response.country && response.country.globalRegions[0]
                ? response.country.globalRegions[0].id
                : null,
            id: contact && contact.location ? contact.location.id : null,
            version: contact && contact.location ? contact.location.version : 0
          }
        : null,
      role: response.role ? response.role.id : null,
      id: contact ? contact.id : null,
      version: contact ? contact.version : 0
    };
    return modalContact;
  }

  public setLocationValues(contact: ContactInterface) {
    if (!this.countries) {
      this.getCountries().subscribe(countries => {
        this.countries = countries;
        this.contactDetails = this.setLocation(contact);
        this.contactSubject.next(this.contactDetails);
      });
    } else {
      this.contactDetails = this.setLocation(contact);
      this.contactSubject.next(this.contactDetails);
    }
  }

  private setLocation(contact: ContactInterface): ContactInterface {
    let cityStateZip = '';

    const country: any =
      contact.location && contact.location.countryId
        ? this.countries.find(
            countryResp => countryResp.id === contact.location.countryId
          )
        : null;

    const state: any =
      country && country.stateOrProvinces
        ? country.stateOrProvinces.find(
            stateResp => stateResp.id === contact.location.stateOrProvinceId
          )
        : null;

    cityStateZip = cityStateZip
      .concat(contact.city ? contact.city + ', ' : '')
      .concat(state ? state.name + ', ' : '')
      .concat(contact.zip ? contact.zip : '');

    return (contact = { ...contact, country, state, cityStateZip });
  }
}
