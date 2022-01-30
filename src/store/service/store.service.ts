import { Inject, Injectable } from '@nestjs/common';
import { BookService } from '@src/book/service/book.service';
import { Book } from '@src/database/entity/book.entity';
import { StoreItem } from '@src/database/entity/store-item.entity';
import { Store } from '@src/database/entity/store.entity';
import { Repository } from 'typeorm';
import { StoreItemService } from './store-item.service';

export class CreateStoreDto {
    readonly name: string;
}

export class RegisterBookDto {
    readonly bookId: number;
    readonly storeId: number;
}

@Injectable()
export class StoreService {
    constructor(
        @Inject('STORE_REPOSITORY')
        private readonly storeRepository: Repository<Store>,
        private readonly bookService: BookService,
        private readonly storeItemService: StoreItemService,
    ) {}

    async createStore({ name }: CreateStoreDto): Promise<Store> {
        const existsStore = await this.findByName(name);
        if (existsStore)
            throw new Error('the name of the store already exists');

        const store: Store = {
            name,
        };
        return await this.create(store);
    }

    private async create(store: Store): Promise<Store> {
        return await this.storeRepository.save(store);
    }

    async registerBook({ storeId, bookId }: RegisterBookDto) {
        const store = await this.findById(storeId);
        const book = await this.bookService.findById(bookId);
        return await this.storeItemService.createItem({ store, book });
    }

    async findByName(name: string): Promise<Store> {
        return await this.storeRepository.findOne({ name });
    }

    async findById(id: number): Promise<Store> {
        return await this.storeRepository.findOne({ id });
    }

    async searchBooksInStore(
        targetStoreId: number,
        keyword: string,
    ): Promise<Book[]> {
        const books = await this.bookService.findByKeyword(keyword);
        if (!books.length) return [];

        const storeItems = await this.storeItemService.findByBooksAndStore(
            books,
            targetStoreId,
        );
        const result = storeItems.map((storeItem) => {
            return books.find((book) => book.id === storeItem.bookId);
        });
        return result;
    }
}
