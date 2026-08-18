import {Service} from '@/services/service';
import {GetSessionService} from '@/services/get-session-service';
import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';

type Props<Input, Output> = {
  getSessionService: GetSessionService;
  service: Service<Input, Output>;
  roles: string[];
};

type MediatorInput = {
  sessionId: string;
};

type CombinedInput<Input> = MediatorInput & Input;

export class AccessMediatorService<Input, Output> {
  protected _getSessionService: GetSessionService;
  protected _service: Service<Input, Output>;
  protected _roles: string[];

  public constructor(props: Props<Input, Output>) {
    this._getSessionService = props.getSessionService;
    this._service = props.service;
    this._roles = props.roles;
  }

  public async execute(input: CombinedInput<Input>) {
    const sessionResult = await this._getSessionService.execute({
      sessionId: input.sessionId,
    });
    if ((sessionResult).hasFailed()) {
      return sessionResult;
    }

    const sessionRecord = sessionResult.getValue();
    if (!this._roles.includes(sessionRecord.role)) {
      return Result.fail(Failure.unauthorized());
    }

    return await this._service.execute({
      ...input,
      sessionRecord,
    });
  }
}
