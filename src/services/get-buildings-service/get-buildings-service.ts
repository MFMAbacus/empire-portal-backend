/* eslint-disable max-len */
import axios from 'axios';

import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {BuildingRecord} from '@/records/building-record';

import {b1Password, b1UrlBuildings, b1User} from '@/config/app';

type Input = {
  projectId?: string;
};

export class GetBuildingsService {
  public async execute(input: Input): Promise<Result<BuildingRecord[], Failure>> {
    const response = await axios.request({
      url: b1UrlBuildings,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = response.data as B1ApiResponse;

    let buildingsRecords: BuildingRecord[] = [];

    buildingsRecords = data.map((item) => {
      return {
        id: item.BuildingNo,
        projectId: item.Project,
        name: item.Project + '-' + item.BuildingNo,
      };
    });

    if (typeof input.projectId !== 'undefined') {
      buildingsRecords = buildingsRecords.filter((item) => {
        return item.projectId === input.projectId;
      });
    }

    return Result.ok(buildingsRecords);
  }
}

type B1ApiResponse = [
  {
    BuildingNo: string;
    Project: string;
  }
];
