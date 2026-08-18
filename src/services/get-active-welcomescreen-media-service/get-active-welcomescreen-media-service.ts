import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";

import { WelcomescreenMediaRepository } from "@/repositories/welcomescreen-media-repository";
import { IWelcomescreenMediaRecord } from "@/schemas/welcomescreen-media-schema";

type Props = {
  welcomescreenMediaRepository: WelcomescreenMediaRepository;
};

type Input = {};

export class GetActiveWelcomescreenMediaService {
  protected _activeWelcomescreenMediaRepository: WelcomescreenMediaRepository;

  public constructor(props: Props) {
    this._activeWelcomescreenMediaRepository =
      props.welcomescreenMediaRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IWelcomescreenMediaRecord[], Failure>> {
    try {
      const activeMedia =
        await this._activeWelcomescreenMediaRepository.getActive();

      if (!activeMedia) {
        return Result.fail(Failure.notFound());
      }

      return Result.ok(activeMedia);
    } catch (error) {
      return Result.fail(Failure.badRequest());
    }
  }
}
