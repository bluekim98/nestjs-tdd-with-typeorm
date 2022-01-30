import { Inject, Injectable } from '@nestjs/common';
import { Book } from '@src/database/entity/book.entity';
import { StoreItem } from '@src/database/entity/store-item.entity';
import { Store } from '@src/database/entity/store.entity';
import { In, Repository } from 'typeorm';

export class CreateItemDto {
    readonly store: Store;
    readonly book: Book;
}

@Injectable()
export class StoreItemService {
    constructor(
        @Inject('STORE_ITEM_REPOSITORY')
        private readonly storeItemRepository: Repository<StoreItem>,
    ) {}

    async createItem({ store, book }: CreateItemDto): Promise<StoreItem> {
        if (!store.id) throw new Error('store must be required');
        if (!book.id) throw new Error('book must be required');
        const storeItem: StoreItem = {
            storeId: store.id,
            bookId: book.id,
            writerId: book.writerId,
        };
        return await this.create(storeItem);
    }

    private async create(entity: StoreItem): Promise<StoreItem> {
        return await this.storeItemRepository.save(entity);
    }

    async findByBooksAndStore(
        books: Book[],
        storeId: number,
    ): Promise<StoreItem[]> {
        const bookIds = books.map((book) => book.id);
        return await this.storeItemRepository.find({
            bookId: In(bookIds),
            storeId,
        });
    }
}
