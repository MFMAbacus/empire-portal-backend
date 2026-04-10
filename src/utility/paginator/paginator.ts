import {PaginationData, PaginationOptions} from '@/types/general';

export class Paginator {
  public static paginate<Record>(
      records: Record[],
      paginationOptions: PaginationOptions,
  ): PaginationData<Record> {
    const defaultTotalPerPage = 25;

    const {
      currentPage = 1,
      totalPerPage = defaultTotalPerPage,
    } = paginationOptions;

    const totalRecords = records.length;

    let validTotalPerPage;
    if (totalPerPage < 1) {
      validTotalPerPage = 1;
    } else {
      validTotalPerPage = Number(totalPerPage);
    }

    let totalPages;
    if (totalRecords === 0) {
      totalPages = 1;
    } else {
      totalPages = Math.ceil(totalRecords / validTotalPerPage);
    }

    let validCurrentPage;
    if (currentPage < 1) {
      validCurrentPage = 1;
    } else if (currentPage > totalPages) {
      validCurrentPage = totalPages;
    } else {
      validCurrentPage = Number(currentPage);
    }

    const sliceStart = (validCurrentPage - 1) * validTotalPerPage;
    let sliceEnd = sliceStart + validTotalPerPage;
    const resultRecords = records.slice(sliceStart, sliceEnd);
    sliceEnd = sliceStart + resultRecords.length;

    return {
      records: resultRecords,
      total: totalRecords,
      from: sliceStart + (resultRecords.length === 0 ? 0 : 1),
      to: sliceEnd,
      currentPage: validCurrentPage,
      totalPages,
      totalPerPage: validTotalPerPage,
    };
  }
}
