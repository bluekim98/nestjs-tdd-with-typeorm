import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { WriterModule } from '@src/writer/writer.module';
import { bookRepositories } from './book.repositories';
import { BookService } from './service/book.service';

@Module({
    imports: [DatabaseModule, WriterModule],
    providers: [BookService, ...bookRepositories],
    exports: [BookService],
})
export class BookModule {}
