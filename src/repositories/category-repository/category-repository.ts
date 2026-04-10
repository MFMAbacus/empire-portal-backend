import {CategoryRecord} from '@/records/category-record';

export type GetAllOptions = {
  parentCategoryId?: string;
};

export abstract class CategoryRepository {
  public abstract getAll(options?: GetAllOptions): Promise<CategoryRecord[]>;
  public abstract get(id: string): Promise<CategoryRecord | undefined>;
  public abstract exists(id: string): Promise<boolean>;
}
