import axios from 'axios';

import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {b1Password, b1UrlProjectsUnits, b1User} from '@/config/app';
import {CustomerProjectRecord} from '@/records/project-record';

type Input = {
  phoneNumber: string;
};

export class GetCustomerProjectsService {
  // eslint-disable-next-line max-len
  public async execute(input: Input): Promise<Result<CustomerProjectRecord[], Failure>> {
    const response = await axios.request({
      url: `${b1UrlProjectsUnits}?Phone=${input.phoneNumber}`,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = response.data as B1ApiResponse;

    const projectsRecords = data.map((item) => {
      return {
        projectId: item.Project,
        unitId: item.Unit,
      };
    });

    return Result.ok(projectsRecords);
  }
}

type B1ApiResponse = [
  {
    Project: string;
    Unit: string;
  }
];
