import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database/database.module';
import { storeRepositories } from './store.repositories';
import { StoreService } from './store.service';

@Module({
    imports: [DatabaseModule],
    providers: [StoreService, ...storeRepositories],
})
export class StoreModule {}
