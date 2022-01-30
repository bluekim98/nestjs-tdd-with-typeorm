import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { StoreModule } from './store/store.module';
import { WriterModule } from './writer/writer.module';
import { BookModule } from './book/book.module';

@Module({
    imports: [AppConfigModule, DatabaseModule, StoreModule, WriterModule, BookModule],
})
export class AppModule {}
