import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { _slugify } from '@/utils';

import { FilterRequest, PagianteFilterRequest } from './requests';
import { _db_slugify } from './utils';

interface IQueryFilterOption {
  search?: string[];
  sort?: Record<string, 'asc' | 'desc'>;
}

export class LengthAwarePaginator<T> {
  items: T[];

  total: number;

  size: number;

  page: number;

  last_page: number;

  constructor(items: T[], total: number, size: number, page: number) {
    this.items = items;
    this.total = total;
    this.size = size;
    this.page = page;
    this.last_page = Math.max(Math.ceil(total / size), 1);
  }
}

export function buildQueryFilter<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  request: FilterRequest,
  options: IQueryFilterOption,
): SelectQueryBuilder<T> {
  if (request?.q?.trim?.length && options?.search?.length) {
    const { search } = options;

    const keyword = _slugify(request.q, {
      replacement: '-',
      lower: true,
      trim: true,
    });

    query
      .andWhere(
        new Brackets((qb) => {
          search.forEach((key) => {
            qb.orWhere(`${_db_slugify(key)} LIKE :keyword`);
          });

          return qb;
        }),
      )
      .setParameter('keyword', `%${keyword}%`);
  }

  return query;
}

export async function buildPaginateQuery<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  request: PagianteFilterRequest,
): Promise<LengthAwarePaginator<T>> {
  const total = await query.clone().getCount();

  let items: T[] = [];

  if (total > 0) {
    items = await query
      .skip((request.page - 1) * request.size)
      .take(request.size)
      .getMany();
  }

  return new LengthAwarePaginator(items, total, request.size, request.page);
}

export async function buildPaginateQueryFilter<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  request: PagianteFilterRequest,
  options?: IQueryFilterOption,
): Promise<LengthAwarePaginator<T>> {
  buildQueryFilter(query, request, options);

  return buildPaginateQuery(query, request);
}
