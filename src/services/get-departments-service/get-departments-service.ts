import axios from 'axios';

import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {DepartmentRecord} from '@/records/department-record';

import {b1Password, b1UrlDepartments, b1User} from '@/config/app';

export class GetDepartmentsService {
  // eslint-disable-next-line max-len
  public async execute(): Promise<Result<DepartmentRecord[], Failure>> {
    const response = await axios.request({
      url: b1UrlDepartments,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = response.data as B1ApiResponse;

    const departmentsRecords = data.map((item) => {
      return {
        id: item.DepartmentCode,
        name: item.DepartmentName,
      };
    });

    return Result.ok(departmentsRecords);
  }
}

type B1ApiResponse = [
  {
    DepartmentCode: string;
    DepartmentName: string;
  }
];
