import { Result } from "@/utility/result";
import { Failure } from "@/utility/failure";

import { WelcomescreenMediaRepository } from "@/repositories/welcomescreen-media-repository";
import { IWelcomescreenMediaRecord } from "@/schemas/welcomescreen-media-schema";

type Props = {
  welcomescreenMediaRepository: WelcomescreenMediaRepository;
};

type Input = {
  id: string;
};

export class GetWelcomescreenMediaItemService {
  protected _welcomescreenMediaRepository: WelcomescreenMediaRepository;

  public constructor(props: Props) {
    this._welcomescreenMediaRepository = props.welcomescreenMediaRepository;
  }

  public async execute(
    input: Input
  ): Promise<Result<IWelcomescreenMediaRecord, Failure>> {
    try {
      const media = await this._welcomescreenMediaRepository.get(input.id);
      
      if (!media) {
        return Result.fail(Failure.notFound());
      }

      return Result.ok(media);
    } catch (error) {
      return Result.fail(Failure.badRequest());
    }
  }
}