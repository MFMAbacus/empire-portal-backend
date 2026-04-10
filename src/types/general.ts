export type PaginationData<Record> = {
  records: Record[];
  total: number;
  from: number;
  to: number;
  currentPage: number;
  totalPages: number;
  totalPerPage: number;
};

export type PaginationOptions = {
  currentPage?: number;
  totalPerPage?: number;
};
