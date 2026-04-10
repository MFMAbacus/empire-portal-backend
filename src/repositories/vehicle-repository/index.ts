import { dbEngine } from "@/config/app";
import { VehicleRepository } from "./vehicle-repository";
import { VehicleRepositoryDb } from "./vehicle-repository-db";

// eslint-disable-next-line max-len
export const vehicleRepository: VehicleRepository = (() => {
  return new VehicleRepositoryDb();
})();

export * from "./vehicle-repository";
export * from "./vehicle-repository-db";
