import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";

import { WelcomescreenMediaRepository } from "@/repositories/welcomescreen-media-repository";
import { IWelcomescreenMediaRecord } from "@/schemas/welcomescreen-media-schema";

type Props = {
  welcomescreenMediaRepository: WelcomescreenMediaRepository;
};

type Input = {};

export class GetWelcomescreenMediaService {
  protected _welcomescreenMediaRepository: WelcomescreenMediaRepository;

  public constructor(props: Props) {
    this._welcomescreenMediaRepository = props.welcomescreenMediaRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IWelcomescreenMediaRecord[], Failure>> {
    try {
      const activeMedia = await this._welcomescreenMediaRepository.getAll();

      return Result.ok(activeMedia);
    } catch (error) {
      return Result.fail(Failure.badRequest());
    }
  }
}
