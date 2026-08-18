import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICustomerRecord } from "@/schemas/customer-schema/cutomer-schema";
import { CustomerRepository } from "@/repositories/customer-repository";
import { b1Password, b1UrlCustomers, b1User } from "@/config/app";
import axios from "axios";
import { SapCustomerRecord } from "@/records/sapCustomers-record";
import { SessionRecord } from "@/records/session-record";

type Props = {
  customerRepository: CustomerRepository;
};

type Input = {
  project: string[];
  building: string[];
  floor: string[];
};

export class GetSapCustomersService {
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<SapCustomerRecord[], Failure>> {
    try {
      console.log("input is", input);

      const { project, building, floor } = input;

      const response = await axios.request({
        url: b1UrlCustomers,
        method: "POST",
        data: {
          Project: project,
          Building: building,
          Floor: floor,
        },
        headers: {
          Authorization: `Basic ${btoa(`${b1User}:${b1Password}`)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = response.data as B1ApiResponse;
      const customersRecords: SapCustomerRecord[] = data.map((item) => ({
        PortalCode: item.PortalCode,
        CardCode: item.CardCode,
        CardName: item.CardName,
        UnitCode: item.UnitCode,
      }));

      return Result.ok(customersRecords);
    } catch (error) {
      return Result.fail(Failure.badRequest());
    }
  }
}

type B1ApiResponse = [
  {
    PortalCode: string;
    CardCode: string;
    CardName: string;
    UnitCode: string;
  }
];
