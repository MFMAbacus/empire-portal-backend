import axios from 'axios';

import {PaginationData, PaginationOptions} from '@/types/general';

import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';
import {Paginator} from '@/utility/paginator';

import {ItemRecord} from '@/records/item-record';

import {b1Password, b1UrlInventory, b1User} from '@/config/app';

type Input = PaginationOptions & {
  id?: string;
  name?: string;
};

export class GetItemsService {
  // eslint-disable-next-line max-len
  public async execute(input: Input): Promise<Result<PaginationData<ItemRecord>, Failure>> {
    const response = await axios.request({
      url: b1UrlInventory,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    // eslint-disable-next-line max-len
    const data = response.data as B1ApiResponse;

    if (!data.Success) {
      throw new Error(`B1 request failed: ${b1UrlInventory}`);
    }

    let itemsRecords = data.Items.map((item) => {
      return {
        id: item.ItemCode,
        name: item.ItemName,
        group: item.ItemGroup,
        price: item.Price,
        quantity: item.Quantity,
      };
    });

    if (input.id) {
      const id = input.id;
      itemsRecords = itemsRecords.filter((current) => {
        return current.id.toLowerCase() === id.toLowerCase();
      });
    }

    if (input.name) {
      const name = input.name;
      itemsRecords = itemsRecords.filter((current) => {
        return current.name.toLowerCase().match(name.toLowerCase());
      });
    }

    return Result.ok(Paginator.paginate(itemsRecords, input));
  }
}

type B1ApiResponse = {
  Success: boolean;
  Message: string;
  Count: number;
  Items: {
    ItemCode: string;
    ItemName: string;
    ItemGroup: string;
    Price: number;
    Quantity: number;
  }[];
};
