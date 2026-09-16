import { IReservationRuleMaster } from "@/schemas/reservation-rule-master-schema";
import ReservationRuleMaster from "@/schemas/reservation-rule-master-schema";
import { MongoRepository } from "@/utility/mongo-repository";
import {
  ReservationRuleMasterRepository,
  GetAllReservationRuleMasterOptions,
} from "./reservation-rule-master-repository";

export class ReservationRuleMasterRepositoryDb
  extends MongoRepository<IReservationRuleMaster>
  implements ReservationRuleMasterRepository
{
  public constructor() {
    super(ReservationRuleMaster);
  }

  public async getAll(options: GetAllReservationRuleMasterOptions = {}): Promise<IReservationRuleMaster[]> {
    const filter: any = {};
    if (typeof options.isArchived !== "undefined") {
      filter.isArchived = options.isArchived ? true : { $ne: true };
    }
    return super.getAll(filter);
  }

  public async get(id: string): Promise<IReservationRuleMaster | undefined> {
    return super.get(id);
  }

  public async exists(id: string): Promise<boolean> {
    return super.exists(id);
  }

  public async Create(record: Partial<IReservationRuleMaster>): Promise<IReservationRuleMaster> {
    return await super.create(record as IReservationRuleMaster);
  }

  public async Update(record: Partial<IReservationRuleMaster>): Promise<IReservationRuleMaster | undefined> {
    return await super.update(record);
  }

  public async delete(id: string): Promise<IReservationRuleMaster | null> {
    return await super.delete(id);
  }
}
