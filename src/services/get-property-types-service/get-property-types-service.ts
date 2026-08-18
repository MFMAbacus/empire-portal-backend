/* eslint-disable max-len */
import axios from 'axios';

import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

import {PropertyTypeRecord} from '@/records/property-type-record';

import {b1Password, b1UrlPropertyTypes, b1User} from '@/config/app';

export class GetPropertyTypesService {
  public async execute(): Promise<Result<PropertyTypeRecord[], Failure>> {
    const response = await axios.request({
      url: b1UrlPropertyTypes,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const data = response.data as B1ApiResponse;

    let propertyTypesRecords: PropertyTypeRecord[] = [];

    propertyTypesRecords = data.map((item) => {
      return {
        id: item.Code,
        name: item.Name,
      };
    });

    return Result.ok(propertyTypesRecords);
  }
}

type B1ApiResponse = [
  {
    Code: string;
    Name: string;
  }
];
