import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { WriterService } from './service/writer.service';
import { writerRepositories } from './writer.repositories';

@Module({
    imports: [DatabaseModule],
    providers: [WriterService, ...writerRepositories],
    exports: [WriterService],
})
export class WriterModule {}
