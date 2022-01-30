import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { bookRepositories } from './book.repositories';
import { BookService } from './book.service';

@Module({
    imports: [DatabaseModule],
    providers: [BookService, ...bookRepositories],
})
export class BookModule {}
