/* eslint-disable max-len */
import axios from 'axios';

import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {UnitRecord} from '@/records/unit-record';

import {b1Password, b1UrlUnits, b1User} from '@/config/app';

type Input = {
  propertyTypes?: string[];
  purposes?: string[];
  projects?: string[];
  buildings?: string[];
  fllors?: string[];
  customers?: string[];
};

export class GetUnitsService {
  public async execute(input: Input): Promise<Result<UnitRecord[], Failure>> {
    const response = await axios.request({
      url: b1UrlUnits,
      method: 'POST',
      data: {
        'PropType': input.propertyTypes || [],
        'PropPurpose': input.purposes || [],
        'Project': input.projects || [],
        'Building': input.buildings || [],
        'Floor': input.fllors || [],
        'Customer': input.customers || [],
      },
      headers: {
        'Authorization': `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = response.data as B1ApiResponse;

    let unitsRecords: UnitRecord[] = [];

    unitsRecords = data.map((item) => {
      return {
        id: item.Unit,
        floorId: item.Floor,
        name: item.Unit,
      };
    });

    return Result.ok(unitsRecords);
  }
}

type B1ApiResponse = [
  {
    Unit: string;
    Floor: string;
  }
];
