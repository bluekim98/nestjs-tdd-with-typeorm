import { Writer } from '@src/database/entity/writer.entity';
import { Connection } from 'typeorm';

export const writerRepositories = [
    {
        provide: 'WRITER_REPOSITORY',
        useFactory: (connection: Connection) =>
            connection.getRepository(Writer),
        inject: ['DATABASE_CONNECTION'],
    },
];
