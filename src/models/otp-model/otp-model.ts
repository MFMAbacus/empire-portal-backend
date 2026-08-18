import {Model} from '@/utility/model';
import {ValidationBag} from '@/utility/validation-bag';

import {OtpRecord} from '@/records/otp-record';

export class OtpModel extends Model {
  public static make(record: OtpRecord): OtpModel {
    const model = new OtpModel(Model._makeAttributes(record));
    return model;
  }

  public validate(): ValidationBag {
    const validationBag = ValidationBag.make();
    return validationBag;
  }
}
