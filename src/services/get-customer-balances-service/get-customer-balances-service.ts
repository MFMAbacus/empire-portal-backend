import axios from "axios";

import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";

import { b1Password, b1UrlBalances, b1User } from "@/config/app";
import { CustomerBalanceRecord } from "@/records/balance-record";

type Input = {
  phoneNumber: string;
};

export class GetCustomerBalancesService {
  // eslint-disable-next-line max-len
  public async execute(
    input: Input
  ): Promise<Result<CustomerBalanceRecord[], Failure>> {
    const response = await axios.request({
      url: `${b1UrlBalances}?Phone=${input.phoneNumber}`,
      method: "GET",
      headers: {
        Authorization: `Basic ${btoa(`${b1User}:${b1Password}`)}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = response.data as B1ApiResponse;

    const projectsRecords = data.map((item) => {
      return {
        customerCode: item.CardCode,
        customerName: item.CardName,
        balance: item.CustomerBalance,
        unitCode: item.UnitCode,
      };
    });

    return Result.ok(projectsRecords);
  }
}

type B1ApiResponse = [
  {
    CardCode: string;
    CardName: string;
    CustomerBalance: number;
    UnitCode: string;
  }
];
