export interface BusinessProcessOverviewInterface {
  id: string;
  version: number;
  identifier: string;
  name: string;
  description: string;
  lastModified: string;
  entityType: string;
  contact: ContactInterface;
  contacts: ContactInterface[];
  tags: any[];
  buildAssessmentUrl: null;
  status: string;
  algorithmRiskIndicator: null;
  inherentRiskIndicator: null;
  residualRiskIndicator: null;
  incompleteRiskEvaluationFields: any[];
  mapped: boolean;
}

interface ContactInterface {
  id: string;
  version: number;
  address: null;
  city: null;
  email: null;
  fullName: string;
  phone: null;
  zip: null;
  location: LocationInterface;
}

interface LocationInterface {
  id: string;
  version: number;
  countryCode: null;
  countryName: null;
  regionCode: null;
  regionName: null;
  stateOrProvinceCode: null;
  stateOrProvinceId: null;
  stateOrProvinceName: null;
}

export interface BusinessProcessApprovalInterface {
  id: string;
  version: number;
  name: string;
  identifier: string;
  status: string;
  associations: AssociationInterface[];
  processingPurposes: ProcessingPurposeInterface[];
}

export interface AssociationInterface {
  processingPurposeId: string;
  legalBasisId: string;
}

export interface ProcessingPurposeInterface {
  id: string;
  version: number;
  category: string;
  name: string;
  isCustom: boolean;
  isCategoryCustom: boolean;
}

export interface BusinessProcessApprovalUpdateInterface {
  associations: AssociationInterface[];
  id: string;
  status: string;
  version: number;
}

export interface BusinessProcessApprovalUpdateResponseInterface {
  id: string;
  version: number;
}

export interface BusinessProcessOwnerInterface {
  id?: string;
  companyId: string;
  companyName?: string;
  departmentId: string;
  departmentName: string;
  email: string;
  created?: string;
  lastModified?: string;
  primaryOwner?: boolean;
  fullName: string;
  role: string;
  version: number;
}

export interface BusinessProcessDetailsInterface {
  id: string;
  version: number;
  name: string;
  description: string;
  dataSubjectVolumeId: string | null;
}

export interface BusinessProcessDetails {
  id: string;
  version: number;
  name: string;
  description: string;
  dataSubjectVolume: DataSubjectVolume | null;
}

export interface DataSubjectVolume {
  id: string;
  name: string;
}

export interface NotesInterface {
  id: string;
  version: number;
  notes: string;
}

export interface StatusInterface {
  id: string;
  status: string;
  version: number;
}
