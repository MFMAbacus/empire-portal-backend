import {CategoryRecord} from '@/records/category-record';

import {CategoryRepository, GetAllOptions} from './category-repository';
import {Collection} from '@/utility/collection';

const collection = Collection.make<CategoryRecord>();

collection.add({
  id: 'Y-000001',
  parentCategoryId: null,
  title: 'Internet maintenance',
});
collection.add({
  id: 'Y-000002',
  parentCategoryId: null,
  title: 'Electrical',
});
collection.add({
  id: 'Y-000003',
  parentCategoryId: null,
  title: 'Plumbing',
});
collection.add({
  id: 'Y-000004',
  parentCategoryId: null,
  title: 'Carpenter',
});
collection.add({
  id: 'Y-000005',
  parentCategoryId: null,
  title: 'Painting',
});
collection.add({
  id: 'Y-000006',
  parentCategoryId: null,
  title: 'Gas Re-filling',
});
collection.add({
  id: 'Y-000007',
  parentCategoryId: null,
  title: 'Parking',
});
collection.add({
  id: 'Y-000008',
  parentCategoryId: null,
  title: 'HVAC',
});
collection.add({
  id: 'Y-000009',
  parentCategoryId: null,
  title: 'Others',
});

collection.add({
  id: 'Y-000101',
  parentCategoryId: 'Y-000001',
  title: 'My internet has a balance, but it is not working',
});
collection.add({
  id: 'Y-000102',
  parentCategoryId: 'Y-000001',
  title: 'I have a weak Wi-Fi signal in my unit',
});
collection.add({
  id: 'Y-000103',
  parentCategoryId: 'Y-000001',
  title: 'My internet has a slow speed',
});
collection.add({
  id: 'Y-000104',
  parentCategoryId: 'Y-000001',
  title: 'I need a wi-fi repeater in my unit',
});
collection.add({
  id: 'Y-000105',
  parentCategoryId: 'Y-000001',
  title: 'Router damaged',
});
collection.add({
  id: 'Y-000106',
  parentCategoryId: 'Y-000001',
  title: 'Other (Please explain)',
});

collection.add({
  id: 'Y-000201',
  parentCategoryId: 'Y-000002',
  title: 'I have a short circuit in my unit',
});
collection.add({
  id: 'Y-000202',
  parentCategoryId: 'Y-000002',
  title: 'I do have an electricity balance, but there is no power',
});
collection.add({
  id: 'Y-000203',
  parentCategoryId: 'Y-000002',
  title: 'Water boiler is not working',
});
collection.add({
  id: 'Y-000204',
  parentCategoryId: 'Y-000002',
  title: 'I need a lighting maintenance',
});
collection.add({
  id: 'Y-000205',
  parentCategoryId: 'Y-000002',
  title: 'Unit doorbell is not working',
});
collection.add({
  id: 'Y-000206',
  parentCategoryId: 'Y-000002',
  title: 'My AC is not working',
});
collection.add({
  id: 'Y-000207',
  parentCategoryId: 'Y-000002',
  title: 'Other (Please explain)',
});

collection.add({
  id: 'Y-000301',
  parentCategoryId: 'Y-000003',
  title: 'There is water dropping from the above apartment',
});
collection.add({
  id: 'Y-000302',
  parentCategoryId: 'Y-000003',
  title: 'There is a water drop from the AC indoor unit',
});
collection.add({
  id: 'Y-000303',
  parentCategoryId: 'Y-000003',
  title: 'Water boiler is not working',
});
collection.add({
  id: 'Y-000304',
  parentCategoryId: 'Y-000003',
  title: 'There is a bad smell in the apartment',
});
collection.add({
  id: 'Y-000305',
  parentCategoryId: 'Y-000003',
  title: 'Other (Please explain)',
});

collection.add({
  id: 'Y-000401',
  parentCategoryId: 'Y-000004',
  title: 'I forget my keys inside apartment',
});
collection.add({
  id: 'Y-000402',
  parentCategoryId: 'Y-000004',
  title: 'I need new locker for my apartment’s door',
});
collection.add({
  id: 'Y-000403',
  parentCategoryId: 'Y-000004',
  title: 'I need carpenter for door / window adjustment',
});
collection.add({
  id: 'Y-000405',
  parentCategoryId: 'Y-000004',
  title: 'Other (Please explain)',
});

collection.add({
  id: 'Y-000501',
  parentCategoryId: 'Y-000005',
  title: 'I need painting for my unit',
});
collection.add({
  id: 'Y-000502',
  parentCategoryId: 'Y-000005',
  title: 'I need wall/ceiling repairing.',
});
collection.add({
  id: 'Y-000503',
  parentCategoryId: 'Y-000005',
  title: 'Other (Please explain)',
});

collection.add({
  id: 'Y-000601',
  parentCategoryId: 'Y-000006',
  title: 'My access card to the building is not working',
});
collection.add({
  id: 'Y-000602',
  parentCategoryId: 'Y-000006',
  title: 'My access card/sticker to compound barrier is not working',
});
collection.add({
  id: 'Y-000603',
  parentCategoryId: 'Y-000006',
  title: 'My mobile application (service app) has a problem',
});
collection.add({
  id: 'Y-000604',
  parentCategoryId: 'Y-000006',
  title: 'Other (Please explain)',
});

// eslint-disable-next-line max-len
export class CategoryRepositoryMemory implements CategoryRepository {
  public async getAll(options: GetAllOptions = {}): Promise<CategoryRecord[]> {
    const {
      parentCategoryId,
    } = options;

    return collection.findMany((record) => {
      let predicate = true;

      if (parentCategoryId) {
        predicate &&= record.parentCategoryId === parentCategoryId;
      }

      return predicate;
    });
  }

  public async get(id: string): Promise<CategoryRecord | undefined> {
    return collection.find((record) => {
      return record.id === id;
    });
  }

  public async exists(id: string): Promise<boolean> {
    return Boolean(collection.find((current) => {
      return current.id === id;
    }));
  }
}
