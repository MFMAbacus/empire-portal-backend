import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { GeneralConfigurationRepository } from "@/repositories/general-configuration-repository";
import { IGeneralConfigurationRecord } from "@/schemas/general-configuration-schema";

type Props = {
  generalConfigurationRepository: GeneralConfigurationRepository;
};

type Input = {};

export class GetGeneralConfigurationsService {
  protected _repository: GeneralConfigurationRepository;

  public constructor(props: Props) {
    this._repository = props.generalConfigurationRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IGeneralConfigurationRecord[], Failure>> {
    try {
      await this._repository.initializePredefinedConfigurations();
      const configurations: IGeneralConfigurationRecord[] =
        await this._repository.getAll();

      return Result.ok(configurations);
    } catch (error) {
      return Result.fail(
        Failure.badRequest("Failed to retrieve general configurations")
      );
    }
  }
}
