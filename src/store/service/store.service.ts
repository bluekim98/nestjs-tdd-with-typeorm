import { Inject, Injectable } from '@nestjs/common';
import { BookService } from '@src/book/service/book.service';
import { StoreItem } from '@src/database/entity/store-item.entity';
import { Store } from '@src/database/entity/store.entity';
import { Repository } from 'typeorm';

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

    async registerBook(dto: RegisterBookDto) {
        const store = await this.findById(dto.storeId);
        if (!store) throw new Error('target store not exists');
        const book = await this.bookService.findById(dto.bookId);
        if (!book) throw new Error('not exists book');
    }

    private async throwIsNotValidToRegisterBook(dto: RegisterBookDto) {
        const store = await this.findById(dto.storeId);
        if (!store) throw new Error('target store not exists');
        const book = await this.bookService.findById(dto.bookId);
        if (!book) throw new Error('not exists book');
    }

    async findByName(name: string): Promise<Store> {
        return await this.storeRepository.findOne({ name });
    }

    async findById(id: number): Promise<Store> {
        return await this.storeRepository.findOne({ id });
    }

    async searchBooks(targetStoreId: number, keyword: string) {
        const books = await this.bookService.findByKeyword(keyword);
    }
}
