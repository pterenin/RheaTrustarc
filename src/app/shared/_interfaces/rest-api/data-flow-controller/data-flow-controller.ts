export interface GetItSystemEntityInterface {
  dataElementIds: string[];
  dataSubjects: DataSubjectInterface[];
  dataElements: DataElementInterface[];
  processingPurposes: ProcessingPurposeInterface[];
  entityId: string;
  legalEntity: LegalEntityInterface;
  locations: LocationElementInterface[];
  name: string;
  processingPurposeIds: string[];
  locationIds?: string[];
}

interface DataSubjectInterface {
  businessProcessId: string;
  category: string;
  dataElementIds: string[];
  dataSubjectType: string;
  entityId: string;
  locationIds: string[];
  mapped: boolean;
  nodeId: string;
  version: number;
}

// TODO: update
interface DataElementInterface {
  businessProcessId: string;
  category: string;
  dataElementIds: string[];
  dataSubjectType: string;
  entityId: string;
  locationIds: string[];
  mapped: boolean;
  nodeId: string;
  version: number;
}

// TODO: update
interface ProcessingPurposeInterface {
  businessProcessId: string;
  category: string;
  dataElementIds: string[];
  dataSubjectType: string;
  entityId: string;
  locationIds: string[];
  mapped: boolean;
  nodeId: string;
  version: number;
}

interface LegalEntityInterface {
  contact: ContactInterface;
  contactType: ContactTypeInterface;
  created: string;
  description: string;
  entityRole: string;
  externalDataSource: string;
  externalId: string;
  id: string;
  identifier: string;
  industrySectors: IndustrySectorInterface[];
  name: string;
  notes: string;
  ownerId: string;
  ownerName: string;
  type: string;
  version: number;
}

interface ContactInterface {
  address: string;
  city: string;
  email: string;
  fullName: string;
  id: string;
  location: ContactLocationInterface;
  phone: string;
  version: number;
  zip: string;
}

interface ContactLocationInterface {
  businessProcessUsage: BusinessProcessUsageInterface[];
  countryId: string;
  countryName: string;
  countryRegionId: string;
  globalRegionId: string;
  id: string;
  stateOrProvinceId: string;
  stateOrProvinceName: string;
  version: number;
}

interface BusinessProcessUsageInterface {
  bpId: string;
  bpName: string;
}

interface ContactTypeInterface {
  companyEntityUse: boolean;
  id: string;
  type: string;
  version: number;
}

interface IndustrySectorInterface {
  id: string;
  name: string;
  sector: string;
}

interface LocationElementInterface {
  dataTransferCount: number;
  location: ContactLocationInterface;
}
