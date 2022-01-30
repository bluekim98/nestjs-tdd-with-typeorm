import { Book } from '@src/database/entity/book.entity';
import { Connection } from 'typeorm';

export const bookRepositories = [
    {
        provide: 'BOOK_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(Book),
        inject: ['DATABASE_CONNECTION'],
    },
];
