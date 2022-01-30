import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@src/app-config/app-config.module';
import { getConnection, Repository } from 'typeorm';
import { BookModule } from '../book.module';
import { BookService, CreateBookDto } from './book.service';
import Chance from 'chance';
import { WriterService } from '@src/writer/service/writer.service';
import { Book } from '@src/database/entity/book.entity';
import { Writer } from '@src/database/entity/writer.entity';

describe('BookService', () => {
    let bookService: BookService;
    let writerService: WriterService;
    const chance = new Chance();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [BookModule, AppConfigModule],
        }).compile();

        bookService = module.get<BookService>(BookService);
        writerService = module.get<WriterService>(WriterService);
    });

    afterEach(async () => {
        await getConnection().close();
    });

    it('should be defined', () => {
        expect(bookService).toBeDefined();
        expect(writerService).toBeDefined();
    });

    describe('create book', () => {
        const [bookId, writerId] = chance.unique(chance.integer, 2, {
            min: 0,
            max: 100,
        });
        const title = chance.word();

        const book: Book = {
            id: bookId,
            title,
            writerId,
        };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should be throwe name required error', async () => {
            const createBookDto = {} as CreateBookDto;

            try {
                await bookService.createBook(createBookDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('book name must be required');
            }
        });

        it('should be throed not exitsts writer error', async () => {
            const spyFn = jest.spyOn(writerService, 'findById');
            spyFn.mockImplementation(async () => undefined);

            const createBookDto = { title, writerId } as CreateBookDto;

            try {
                await bookService.createBook(createBookDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('not exists writer');
                expect(spyFn).toBeCalledTimes(1);
            }
        });

        it('should be created book', async () => {
            const findWriterSpyFn = jest.spyOn(writerService, 'findById');
            findWriterSpyFn.mockImplementation(
                async (id) => ({ id } as Writer),
            );
            const createSpyFn = jest.spyOn(
                BookService.prototype as any,
                'create',
            );
            createSpyFn.mockImplementation(async () => book);

            const createBookDto = { title, writerId } as CreateBookDto;
            const createdBook = await bookService.createBook(createBookDto);

            expect(findWriterSpyFn).toBeCalledTimes(1);
            expect(createSpyFn).toBeCalledTimes(1);
            expect(createdBook).toBeDefined();
            expect(createdBook).toEqual(book);
        });
    });
});
