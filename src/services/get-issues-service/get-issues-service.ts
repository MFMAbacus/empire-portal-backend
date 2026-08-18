import axios from 'axios';

import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {DepartmentRecord} from '@/records/department-record';

import {b1Password, b1UrlIssues, b1User} from '@/config/app';

type Input = {
  departmentId?: string;
};

export class GetIssuesService {
  // eslint-disable-next-line max-len
  public async execute(input: Input): Promise<Result<DepartmentRecord[], Failure>> {
    const response = await axios.request({
      url: `${b1UrlIssues}?DepartmentCode=${input.departmentId}`,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = response.data as B1ApiResponse;

    const issuesRecords = data.map((item, index) => {
      return {
        id: String(index + 1),
        name: item.Issue,
      };
    });

    return Result.ok(issuesRecords);
  }
}

type B1ApiResponse = [
  {
    DepartmentCode: string;
    SubDepartmentCode: string;
    Issue: string;
  }
];
