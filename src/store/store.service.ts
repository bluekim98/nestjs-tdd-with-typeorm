import { Inject, Injectable } from '@nestjs/common';
import { StoreWriterRelation } from '@src/database/entity/store-writer-relation.entity';
import { Store } from '@src/database/entity/store.entity';
import { Repository } from 'typeorm';

export class CreateStoreDto {
    readonly name: string;
}

export class RegisterWriterDto {
    readonly writerId: number;
    readonly storeId: number;
}

@Injectable()
export class StoreService {
    constructor(
        @Inject('STORE_REPOSITORY')
        private readonly storeRepository: Repository<Store>,
        @Inject('STORE_WRITER_RELATION_REPOSITORY')
        private readonly storeWriterRelationRepository: Repository<StoreWriterRelation>,
    ) {}

    async create(dto: CreateStoreDto): Promise<Store> {
        const existsStore = await this.findByName(dto.name);
        if (existsStore)
            throw new Error('the name of the store already exists');
        return await this.storeRepository.save(dto);
    }

    async registerWriter({
        writerId,
        storeId,
    }: RegisterWriterDto): Promise<StoreWriterRelation> {
        const targetStore = await this.findById(storeId);
        if (!targetStore) throw new Error('not exists target store');

        try {
            const payload: StoreWriterRelation = {
                storeId,
                writerId,
            };
            return await this.storeWriterRelationRepository.save(payload);
        } catch (error) {
            if (error.sqlErrCode === 1452) {
                throw new Error('not exists writer');
            }
            throw error;
        }
    }

    async findByName(name: string): Promise<Store> {
        return await this.storeRepository.findOne({ name });
    }

    async findById(id: number): Promise<Store> {
        return await this.storeRepository.findOne({ id });
    }
}
