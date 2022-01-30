import { ConfigService } from '@nestjs/config';
import { createConnection } from 'typeorm';
import { Book } from './entity/book.entity';
import { StoreItem } from './entity/store-item.entity';
import { Store } from './entity/store.entity';
import { Writer } from './entity/writer.entity';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async (configService: ConfigService) =>
            await createConnection({
                multipleStatements: true,
                type: 'mysql',
                host: configService.get('MYSQL_HOST'),
                port: configService.get<number>('MYSQL_PORT'),
                username: configService.get('MYSQL_USER'),
                password: configService.get('MYSQL_PASSWORD'),
                database: configService.get('MYSQL_DATABASE'),
                maxQueryExecutionTime: 500,
                connectTimeout: 100,
                extra: {
                    connectionLimit: 1,
                },
                entities: [Book, Writer, Store, StoreItem],
                synchronize: true,
                logging: ['error'],
            }),
        inject: [ConfigService],
    },
];
