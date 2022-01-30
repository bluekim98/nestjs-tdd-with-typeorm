import { StoreWriterRelation } from '@src/database/entity/store-writer-relation.entity';
import { Store } from '@src/database/entity/store.entity';
import { Connection } from 'typeorm';

export const storeRepositories = [
    {
        provide: 'STORE_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(Store),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: 'STORE_WRITER_RELATION_REPOSITORY',
        useFactory: (connection: Connection) =>
            connection.getRepository(StoreWriterRelation),
        inject: ['DATABASE_CONNECTION'],
    },
];
