import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";
import { Validation } from "@/utility/validation";
import { Attribute } from "@/utility/attribute";
import { GeneralConfigurationRepository } from "@/repositories/general-configuration-repository";
import { GeneralConfigurationModel } from "@/models/general-configuration-model";
import {
  IGeneralConfigurationRecord,
  UpdateGeneralConfigurationInput,
} from "@/schemas/general-configuration-schema";

type Props = {
  generalConfigurationRepository: GeneralConfigurationRepository;
};

type Input = {
  configKey: string;
  updates: UpdateGeneralConfigurationInput;
};

type Output = {
  configuration: {
    configKey: string;
    configName: string;
    configType: string;
    commissionType?: string;
    commissionValue?: number;
    validationValue?: number;
    serviceType?: string;
    isActive: boolean;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
};

export class UpdateGeneralConfigurationService {
  protected _repository: GeneralConfigurationRepository;

  public constructor(props: Props) {
    this._repository = props.generalConfigurationRepository;
  }

  public async execute(input: Input): Promise<Result<Output, Failure>> {
    const configKey = Attribute.make(input.configKey);
    const configKeyValidationRule = Validation.make(configKey.get())
      .mandatory()
      .string()
      .getRule();

    if (configKeyValidationRule.isError()) {
      return Result.fail(Failure.badRequest("Invalid configuration key"));
    }

    try {
      const existingConfig = await this._repository.get(input.configKey);

      if (!existingConfig) {
        return Result.fail(Failure.notFound());
      }

      const updatedRecord = {
        _id: existingConfig._id,
        id: existingConfig.id,
        configKey: existingConfig.configKey,
        configName: existingConfig.configName,
        configType: existingConfig.configType,
        serviceType: existingConfig.serviceType,
        description: existingConfig.description,
        commissionType:
          input.updates.commissionType ?? existingConfig.commissionType,
        commissionValue:
          input.updates.commissionValue ?? existingConfig.commissionValue,
        validationValue:
          input.updates.validationValue ?? existingConfig.validationValue,
        isActive: input.updates.isActive ?? existingConfig.isActive,
        updatedAt: new Date(),
      };

      const model = GeneralConfigurationModel.make(updatedRecord);
      const validationBag = model.validate();

      if (validationBag.hasErrors()) {
        return Result.fail(Failure.validation(validationBag));
      }

      const updateData: Partial<IGeneralConfigurationRecord> = {
        configKey: existingConfig.configKey,
        commissionType: input.updates.commissionType,
        commissionValue: input.updates.commissionValue,
        validationValue: input.updates.validationValue,
        isActive: input.updates.isActive,
      };

      const result = await this._repository.update(updateData);

      if (!result) {
        return Result.fail(
          Failure.badRequest("Failed to update configuration")
        );
      }

      return Result.ok({
        configuration: {
          configKey: result.configKey,
          configName: result.configName,
          configType: result.configType,
          commissionType: result.commissionType,
          commissionValue: result.commissionValue,
          validationValue: result.validationValue,
          serviceType: result.serviceType,
          isActive: result.isActive,
          description: result.description,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        },
      });
    } catch (error) {
      return Result.fail(
        Failure.badRequest("Failed to update general configuration")
      );
    }
  }
}
