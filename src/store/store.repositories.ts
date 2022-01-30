import { StoreItem } from '@src/database/entity/store-item.entity';
import { Store } from '@src/database/entity/store.entity';
import { Connection } from 'typeorm';

export const storeRepositories = [
    {
        provide: 'STORE_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(Store),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: 'STORE_ITEM_REPOSITORY',
        useFactory: (connection: Connection) =>
            connection.getRepository(StoreItem),
        inject: ['DATABASE_CONNECTION'],
    },
];
