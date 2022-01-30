import { Inject, Injectable } from '@nestjs/common';
import { Book } from '@src/database/entity/book.entity';
import { WriterService } from '@src/writer/service/writer.service';
import { Like, Repository } from 'typeorm';

export class CreateBookDto {
    readonly title: string;
    readonly writerId: number;
}

@Injectable()
export class BookService {
    constructor(
        @Inject('BOOK_REPOSITORY')
        private readonly bookRepository: Repository<Book>,
        private readonly writerService: WriterService,
    ) {}

    async createBook({ title, writerId }: CreateBookDto): Promise<Book> {
        if (!title) throw new Error('book name must be required');
        const writer = await this.writerService.findById(writerId);
        if (!writer) throw new Error('not exists writer');

        const book: Book = {
            title,
            writerId,
        };
        return await this.create(book);
    }

    private async create(book: Book): Promise<Book> {
        return await this.bookRepository.save(book);
    }

    async findById(id: number): Promise<Book> {
        return await this.bookRepository.findOne({ id });
    }

    async findByKeyword(keyword: string): Promise<Book[]> {
        return await this.bookRepository.find({ title: Like(`%${keyword}%`) });
    }
}
