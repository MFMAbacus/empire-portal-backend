import {CategoryRepository} from './category-repository';
import {CategoryRepositoryMemory} from './category-repository-memory';

// eslint-disable-next-line max-len
export const categoryRepository: CategoryRepository = new CategoryRepositoryMemory();

export * from './category-repository';
export * from './category-repository-memory';
