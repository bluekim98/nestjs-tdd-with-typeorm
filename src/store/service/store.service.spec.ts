import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@src/app-config/app-config.module';
import { StoreModule } from '../store.module';
import { CreateStoreDto, RegisterBookDto, StoreService } from './store.service';
import Chance from 'chance';
import { Store } from '@src/database/entity/store.entity';
import { getConnection, Repository } from 'typeorm';
import { StoreItem } from '@src/database/entity/store-item.entity';

describe('StoreService', () => {
    let storeService: StoreService;
    const chance = new Chance();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [StoreModule, AppConfigModule],
        }).compile();

        storeService = module.get<StoreService>(StoreService);
    });

    afterEach(async () => {
        await getConnection().close();
    });

    it('should be defined', () => {
        expect(storeService).toBeDefined();
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
});
