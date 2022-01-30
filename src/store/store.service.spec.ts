import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@src/app-config/app-config.module';
import { StoreModule } from './store.module';
import {
    CreateStoreDto,
    RegisterWriterDto,
    StoreService,
} from './store.service';
import Chance from 'chance';
import { Store } from '@src/database/entity/store.entity';
import { getConnection, Repository } from 'typeorm';
import { StoreWriterRelation } from '@src/database/entity/store-writer-relation.entity';

describe('StoreService', () => {
    let storeService: StoreService;
    let storeWriterRelationRepository: Repository<StoreWriterRelation>;
    const chance = new Chance();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [StoreModule, AppConfigModule],
        }).compile();

        storeService = module.get<StoreService>(StoreService);
        storeWriterRelationRepository = module.get<
            Repository<StoreWriterRelation>
        >('STORE_WRITER_RELATION_REPOSITORY');
    });

    afterEach(async () => {
        await getConnection().close();
    });

    it('should be defined', () => {
        expect(storeService).toBeDefined();
        expect(storeWriterRelationRepository).toBeDefined();
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

        it('should throw exists name error', async () => {
            const spyFn = jest.spyOn(storeService, 'findByName');
            spyFn.mockImplementation(async () => store);
            const createStoreDto: CreateStoreDto = {
                name: city1,
            };

            try {
                await storeService.create(createStoreDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('the name of the store already exists');
                expect(spyFn).toBeCalledTimes(1);
            }
        });
    });

    describe('Register Writer', () => {
        const [storeId, writerId] = chance.unique(chance.integer, 2, {
            min: 0,
            max: 100,
        });
        const registerWriterDto: RegisterWriterDto = {
            writerId,
            storeId,
        };
        const store: Store = {
            id: storeId,
            name: chance.city(),
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should throw not exists target store error', async () => {
            const spyFn = jest.spyOn(storeService, 'findById');
            spyFn.mockImplementation(async () => undefined);

            try {
                await storeService.registerWriter(registerWriterDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('not exists target store');
                expect(spyFn).toBeCalledTimes(1);
            }
        });

        it('should throw not exists writer error', async () => {
            jest.spyOn(storeService, 'findById').mockImplementation(
                async () => store,
            );
            const spyFn = jest.spyOn(storeWriterRelationRepository, 'save');
            spyFn.mockImplementation(async () => {
                throw { sqlErrCode: 1452 };
            });

            try {
                await storeService.registerWriter(registerWriterDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('not exists writer');
                expect(spyFn).toBeCalledTimes(1);
            }
        });
    });
});
