import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { ICustomerRecord } from "@/schemas/customer-schema/cutomer-schema";
import { CustomerRepository } from "@/repositories/customer-repository";

type Props = {
  customerRepository: CustomerRepository;
};

export class GetUsersService {
  protected _customerRepository: CustomerRepository;

  public constructor(props: Props) {
    this._customerRepository = props.customerRepository;
  }

  public async execute(): Promise<Result<ICustomerRecord[], Failure>> {
    const customersRecords = await this._customerRepository.getAll();
    return Result.ok(customersRecords);
  }
}
