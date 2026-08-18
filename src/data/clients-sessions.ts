import {ClientSessionRecord} from '@/records/client-session-record';

export const clientsSessions: {
  records: ClientSessionRecord[];
} = {
  records: [{
    // eslint-disable-next-line max-len
    token: `eZd88aHiQ9WR7VqjZlY4RP:APA91bEaPcTHf_rMld1TdcO9JUHVzTKlhWxadgKdO5VZ3A6fvFx80jrco0VEV9j-pH3l8jqW0hwGq8_3BbXGXgNLvLq7p3F3-fqaKEuVuMEiiEd0R_YWlDPsjgjLuJXAcxaZgJGzau5u`,
    userId: '1234',
    role: 'manager',
  }],
};

export function getTokensByUserId(userId: string): string[] {
  const clientSessionsForUser = clientsSessions.records.filter(
      (record: ClientSessionRecord) => record.userId === userId,
  );

  const tokens: string[] = clientSessionsForUser
      .map((clientSession: ClientSessionRecord) => clientSession.token || '')
      .filter((token: string) => token.trim() !== '');

  return tokens;
}

export function getTokensByUsersIds(usersIds: string[]): string[] {
  const clientSessionsForUser = clientsSessions.records
      .filter((record: ClientSessionRecord) =>
        usersIds.includes(record.userId));

  const tokens: string[] = clientSessionsForUser
      .map((clientSession: ClientSessionRecord) => clientSession.token || '')
      .filter((token: string) => token.trim() !== '');

  return tokens;
}
