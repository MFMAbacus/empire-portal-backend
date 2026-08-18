import {Result} from '@/utility/result';
import {Failure} from '@/utility/failure';
import {Attribute} from '@/utility/attribute';
import {Validation} from '@/utility/validation';

import {CategoryRecord} from '@/records/category-record';
import {CategoryRepository} from '@/repositories/category-repository';
import {ValidationBag} from '@/utility/validation-bag';

type Props = {
  categoryRepository: CategoryRepository;
};

type Input = {
  parentCategoryId?: string;
};

export class GetCategoriesService {
  protected _categoryRepository: CategoryRepository;

  public constructor(props: Props) {
    this._categoryRepository = props.categoryRepository;
  }

  // eslint-disable-next-line max-len
  public async execute(input: Input): Promise<Result<CategoryRecord[], Failure>> {
    const parentCategoryId = Attribute.make(input.parentCategoryId);

    const validationBag = ValidationBag.make();

    validationBag.set('parentCategoryId', Validation
        .make(parentCategoryId.get())
        .optional()
        .string()
        .getRule());

    if (validationBag.hasErrors()) {
      return Result.fail(Failure.validation(validationBag));
    }

    const categoriesRecords = await this._categoryRepository.getAll({
      parentCategoryId: parentCategoryId.get(),
    });
    return Result.ok(categoriesRecords);
  }
}
