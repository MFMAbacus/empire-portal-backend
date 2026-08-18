import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICustomerRecord } from "@/schemas/customer-schema/cutomer-schema";
import { CustomerRepository } from "@/repositories/customer-repository";
import { b1Password, b1UrlCustomerCodeByUnit, b1User } from "@/config/app";
import axios from "axios";

type Props = {
  customerRepository: CustomerRepository;
};

type Input = {
  sessionId: string;
  unitCode: string;
};

export class GetCustomersByUnitService {
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<ICustomerRecord[], Failure>> {
    try {
      const { unitCode } = input;

      const response = await axios.request({
        url: b1UrlCustomerCodeByUnit,
        method: "GET",
        params: {
          SearchBy: unitCode,
        },
        headers: {
          Authorization: `Basic ${btoa(`${b1User}:${b1Password}`)}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = response.data as B1ApiResponse;

      // If no PortalID found, return empty array
      if (!data.PortalID || data.PortalID.length === 0) {
        return Result.ok([]);
      }

      // Get customers from database using the returned portal IDs
      const customers = await this._customerRepository.findByIds(data.PortalID);

      return Result.ok(customers);
    } catch (error) {
      console.error("Error in GetCustomersByUnitService:", error);
      return Result.fail(Failure.badRequest());
    }
  }
}

type B1ApiResponse = {
  PortalID: string[];
};
