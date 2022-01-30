import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { writerRepositories } from './writer.repositories';
import { WriterService } from './writer.service';

@Module({
    imports: [DatabaseModule],
    providers: [WriterService, ...writerRepositories],
})
export class WriterModule {}
