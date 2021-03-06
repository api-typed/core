import { FindManyOptions, Repository } from 'typeorm';
import { PaginationInfo } from './types';

export interface PaginatorOptions<T> {
  perPage: number;
  sortBy?: FindManyOptions<T>['order'];
}

export class Paginator<T = unknown> {
  private readonly options: PaginatorOptions<T>;

  constructor(
    private readonly repository: Repository<T>,
    options: Partial<PaginatorOptions<T>> = {},
  ) {
    this.options = {
      perPage: 20,
      ...options,
    };
  }

  public async getPage(
    page = 1,
  ): Promise<{ items: T[]; info: PaginationInfo }> {
    if (page < 1) {
      throw new Error('Page number must be positive.');
    }

    const { perPage } = this.options;

    const [items, total] = await this.repository.findAndCount({
      order: this.options.sortBy,
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return {
      items,
      info: {
        count: items.length,
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }
}
