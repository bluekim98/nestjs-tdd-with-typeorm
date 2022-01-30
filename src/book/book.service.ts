import { Inject, Injectable } from '@nestjs/common';
import { Book } from '@src/database/entity/book.entity';
import { Repository } from 'typeorm';

export class CreateBookDto {
    readonly name: string;
    readonly writerId: number;
}

@Injectable()
export class BookService {
    constructor(
        @Inject('BOOK_REPOSITORY')
        private readonly bookRepository: Repository<Book>,
    ) {}

    async create(dto: CreateBookDto): Promise<Book> {
        if (!dto.name) throw new Error('book name must be required');
        try {
            return await this.bookRepository.save(dto);
        } catch (error) {
            if (error.sqlErrCode === 1452) {
                throw new Error('not exists writer');
            }
            throw error;
        }
    }
}
