import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@src/app-config/app-config.module';
import { getConnection, Repository } from 'typeorm';
import { BookModule } from './book.module';
import { BookService, CreateBookDto } from './book.service';
import Chance from 'chance';
import { Book } from '@src/database/entity/book.entity';

describe('BookService', () => {
    let bookService: BookService;
    let bookRepository: Repository<Book>;
    const chance = new Chance();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [BookModule, AppConfigModule],
        }).compile();

        bookService = module.get<BookService>(BookService);
        bookRepository = module.get<Repository<Book>>('BOOK_REPOSITORY');
    });

    afterEach(async () => {
        await getConnection().close();
    });

    it('should be defined', () => {
        expect(bookService).toBeDefined();
        expect(bookRepository).toBeDefined();
    });

    describe('create book', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should throw name required error', async () => {
            const createBookDto: CreateBookDto = {
                name: undefined,
                writerId: chance.integer({ min: 0, max: 100 }),
            };
            try {
                await bookService.create(createBookDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('book name must be required');
            }
        });

        it('should throw not exitst writer error', async () => {
            const spyFn = jest.spyOn(bookRepository, 'save');
            spyFn.mockImplementation(async () => {
                throw { sqlErrCode: 1452 };
            });

            const createBookDto: CreateBookDto = {
                name: chance.name(),
                writerId: undefined,
            };
            try {
                await bookService.create(createBookDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('not exists writer');
                expect(spyFn).toBeCalledTimes(1);
            }
        });
    });
});
