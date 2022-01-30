import { Module } from '@nestjs/common';
import { BookModule } from '@src/book/book.module';
import { DatabaseModule } from '@src/database/database.module';
import { storeRepositories } from './store.repositories';
import { StoreService } from './service/store.service';
import { StoreItemService } from './service/store-item.service';

@Module({
    imports: [DatabaseModule, BookModule],
    providers: [StoreService, StoreItemService, ...storeRepositories],
})
export class StoreModule {}
