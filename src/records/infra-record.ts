export type BusinessPartnerRecord = {
  id: string;
  name: string;
};

export type ProjectRecord = {
  id: string;
  businessPartner: BusinessPartnerRecord;
  name: string;
};

export type BuildingRecord = {
  id: string;
  businessPartner: BusinessPartnerRecord;
  project: ProjectRecord;
  name: string;
};

export type FloorRecord = {
  id: string;
  businessPartner: BusinessPartnerRecord;
  project: ProjectRecord;
  building: BuildingRecord;
  name: string;
};

export type UnitRecord = {
  id: string;
  businessPartner: BusinessPartnerRecord;
  project: ProjectRecord;
  building: BuildingRecord;
  floor: FloorRecord;
  name: string;
};
