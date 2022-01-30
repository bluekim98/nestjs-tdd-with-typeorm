import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@src/app-config/app-config.module';
import { StoreModule } from '../store.module';
import Chance from 'chance';
import { getConnection } from 'typeorm';
import { StoreItemService } from './store-item.service';
import { Store } from '@src/database/entity/store.entity';
import { Book } from '@src/database/entity/book.entity';
import { StoreItem } from '@src/database/entity/store-item.entity';

describe('StoreItemService', () => {
    let storeItemService: StoreItemService;
    const chance = new Chance();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [StoreModule, AppConfigModule],
        }).compile();

        storeItemService = module.get<StoreItemService>(StoreItemService);
    });

    afterEach(async () => {
        await getConnection().close();
    });

    it('should be defined', () => {
        expect(storeItemService).toBeDefined();
    });

    describe('create store item', () => {
        const [storeId, bookId, storeItemId, writerId] = chance.unique(
            chance.integer,
            4,
            {
                min: 0,
                max: 100,
            },
        );

        const store = { id: storeId } as Store;
        const book = { id: bookId } as Book;
        const storeItem: StoreItem = {
            id: storeItemId,
            storeId,
            bookId,
            writerId,
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should be throwed store required error', async () => {
            const store = {} as Store;

            try {
                await storeItemService.createItem({ store, book });
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('store must be required');
            }
        });

        it('should be throwed store required error', async () => {
            const book = {} as Book;

            try {
                await storeItemService.createItem({ store, book });
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('book must be required');
            }
        });

        it('should be created item', async () => {
            const spyFn = jest.spyOn(
                StoreItemService.prototype as any,
                'create',
            );
            spyFn.mockImplementation(async () => storeItem);

            const createdItem = await storeItemService.createItem({
                store,
                book,
            });
            expect(spyFn).toBeCalledTimes(1);
            expect(createdItem).toBeDefined();
            expect(createdItem).toEqual(storeItem);
        });
    });
});
