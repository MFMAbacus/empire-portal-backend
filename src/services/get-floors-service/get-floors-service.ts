/* eslint-disable max-len */
import axios from 'axios';

import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {FloorRecord} from '@/records/floor-record';

import {b1Password, b1UrlFloors, b1User} from '@/config/app';

type Input = {
  buildingId?: string;
};

export class GetFloorsService {
  public async execute(input: Input): Promise<Result<FloorRecord[], Failure>> {
    const response = await axios.request({
      url: b1UrlFloors,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = response.data as B1ApiResponse;

    let floorsRecords: FloorRecord[] = [];

    floorsRecords = data.map((item) => {
      return {
        id: item.BuildingNo + '-' + item.Floor,
        buildingId: item.BuildingNo,
        name: item.BuildingNo + '-' + item.Floor,
      };
    });

    if (typeof input.buildingId !== 'undefined') {
      floorsRecords = floorsRecords.filter((item) => {
        return item.buildingId === input.buildingId;
      });
    }

    return Result.ok(floorsRecords);
  }
}

type B1ApiResponse = [
  {
    BuildingNo: string;
    Floor: string;
  }
];
