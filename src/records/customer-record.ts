export type VehicleRecord = {
  id: string;
  palletNumber: string;
  model: string;
  type: string;
  color: string;
  name: string;
};

export type CustomerRecord = {
  id: string;
  projectId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  comments: string | null;
  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
  emergencyContactNumber: string | null;
  vehicles: VehicleRecord[];
  username: string;
  password: string;
  isInvited: boolean;
  isActive: boolean;
  isBlocked: boolean;
  profilePicture: string | null;
};

export type RowType = {
  id: string;
  project_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  dob: string;
  address: string;
  comments: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_number: string | null;
  username: string;
  password: string;
  is_invited: boolean;
  is_active: boolean;
  is_blocked: boolean;
  profile_picture: string | null;
};

export type VehicleRowType = {
  id: string;
  pallet_number: string;
  model: string;
  type: string;
  color: string;
  customer_id: string;
};
