type MeetingInvitationStatus = 'pending' | 'accepted' | 'refused';

export type MeetingImportance = 'low' | 'medium' | 'high' | 'urgent';

export type MeetingInvitationRecord = {
  staffId: string;
  staffName: string;
  status: MeetingInvitationStatus;
  isRequired: boolean;
  date: string | null;
  time: string | null;
};

export type MeetingRecord = {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  importance: MeetingImportance;
  agenda: string;
  invitation: MeetingInvitationRecord[];
  isArchived: boolean;
};
