import axios from 'axios';

import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {ProjectRecord} from '@/records/project-record';

import {b1Password, b1UrlSalespersons, b1User} from '@/config/app';

export class GetSalespersonsService {
  public async execute(): Promise<Result<ProjectRecord[], Failure>> {
    const response = await axios.request({
      url: b1UrlSalespersons,
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
        id: item.SlpCode,
        name: item.SlpName,
      };
    });

    return Result.ok(projectsRecords);
  }
}

type B1ApiResponse = [
  {
    SlpCode: string;
    SlpName: string;
  }
];
