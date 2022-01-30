import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@src/app-config/app-config.module';
import { StoreModule } from '../store.module';
import { CreateStoreDto, StoreService } from './store.service';
import Chance from 'chance';
import { Store } from '@src/database/entity/store.entity';
import { getConnection } from 'typeorm';
import { BookService } from '@src/book/service/book.service';
import { StoreItem } from '@src/database/entity/store-item.entity';
import { StoreItemService } from './store-item.service';
import { Book } from '@src/database/entity/book.entity';

describe('StoreService', () => {
    let storeService: StoreService;
    let bookService: BookService;
    let storeItemService: StoreItemService;
    const chance = new Chance();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [StoreModule, AppConfigModule],
        }).compile();

        storeService = module.get<StoreService>(StoreService);
        bookService = module.get<BookService>(BookService);
        storeItemService = module.get<StoreItemService>(StoreItemService);
    });

    afterEach(async () => {
        await getConnection().close();
    });

    it('should be defined', () => {
        expect(storeService).toBeDefined();
        expect(bookService).toBeDefined();
        expect(storeItemService).toBeDefined();
    });

    describe('create store', () => {
        const [city1, city2] = chance.unique(chance.city, 2);
        const [storeId] = chance.unique(chance.integer, 1, {
            min: 0,
            max: 100,
        });
        const store: Store = {
            id: storeId,
            name: city1,
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should be throwed name already exists error', async () => {
            const spyFn = jest.spyOn(storeService, 'findByName');
            spyFn.mockImplementation(async () => store);

            const createStoreDto = { name: city1 } as CreateStoreDto;
            try {
                await storeService.createStore(createStoreDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('the name of the store already exists');
                expect(spyFn).toBeCalledTimes(1);
            }
        });

        it('should be created store', async () => {
            const findSpyFn = jest.spyOn(storeService, 'findByName');
            findSpyFn.mockImplementation(async () => undefined);
            const createSpyFn = jest.spyOn(
                StoreService.prototype as any,
                'create',
            );
            createSpyFn.mockImplementation(async () => store);

            const createStoreDto = { name: city1 } as CreateStoreDto;
            const createdStore = await storeService.createStore(createStoreDto);

            expect(findSpyFn).toBeCalledTimes(1);
            expect(createSpyFn).toBeCalledTimes(1);
            expect(createdStore).toBeDefined();
            expect(createdStore).toEqual(store);
        });
    });

    describe('search books', () => {
        const keyword = chance.word();

        const [
            targetStoreId,
            storeItemId1,
            storeItemId2,
            writerId,
            bookId1,
            bookId2,
            bookId3,
        ] = chance.unique(chance.integer, 7, { min: 0, max: 100 });
        const books: Book[] = [
            {
                id: bookId1,
                title: keyword,
                writerId,
            },
            {
                id: bookId2,
                title: keyword,
                writerId,
            },
            {
                id: bookId3,
                title: keyword,
                writerId,
            },
        ];
        const storeItems: StoreItem[] = [
            {
                id: storeItemId1,
                storeId: targetStoreId,
                writerId,
                bookId: bookId1,
            },
            {
                id: storeItemId2,
                storeId: targetStoreId,
                writerId,
                bookId: bookId2,
            },
        ];

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should be returned zero items', async () => {
            const spyFn = jest.spyOn(bookService, 'findByKeyword');
            spyFn.mockImplementation(async () => []);
            const books = await storeService.searchBooksInStore(
                targetStoreId,
                keyword,
            );
            expect(spyFn).toBeCalledTimes(1);
            expect(books.length).toBe(0);
        });

        it('should be find 2 items', async () => {
            const findBookSpyFn = jest.spyOn(bookService, 'findByKeyword');
            findBookSpyFn.mockImplementation(async () => books);
            const findStoreItemSpyFn = jest.spyOn(
                storeItemService,
                'findByBooksAndStore',
            );
            findStoreItemSpyFn.mockImplementation(async () => storeItems);

            const searchedBooks = await storeService.searchBooksInStore(
                targetStoreId,
                keyword,
            );

            expect(searchedBooks.length).toBe(2);
            expect(searchedBooks.length).not.toBe(books.length);
            expect(findBookSpyFn).toBeCalledTimes(1);
            expect(findStoreItemSpyFn).toBeCalledTimes(1);
        });
    });
});
