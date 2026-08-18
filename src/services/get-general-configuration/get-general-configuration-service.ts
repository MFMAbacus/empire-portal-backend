import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Validation } from "@/utility/validation";
import { Attribute } from "@/utility/attribute";
import { GeneralConfigurationRepository } from "@/repositories/general-configuration-repository";
import { IGeneralConfigurationRecord } from "@/schemas/general-configuration-schema";

type Props = {
  generalConfigurationRepository: GeneralConfigurationRepository;
};

type Input = {
  configKey: string;
};

export class GetGeneralConfigurationService {
  protected _repository: GeneralConfigurationRepository;

  public constructor(props: Props) {
    this._repository = props.generalConfigurationRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IGeneralConfigurationRecord, Failure>> {
    const configKey = Attribute.make(input.configKey);
    const configKeyValidationRule = Validation.make(configKey.get())
      .mandatory()
      .string()
      .getRule();

    if (configKeyValidationRule.isError()) {
      return Result.fail(Failure.badRequest("Invalid configuration key"));
    }

    try {
      const configuration: IGeneralConfigurationRecord | undefined =
        await this._repository.get(input.configKey);

      if (!configuration) {
        return Result.fail(Failure.notFound());
      }

      return Result.ok(configuration);
    } catch (error) {
      return Result.fail(
        Failure.badRequest("Failed to retrieve general configuration")
      );
    }
  }
}
