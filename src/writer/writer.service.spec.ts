import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@src/app-config/app-config.module';
import { getConnection } from 'typeorm';
import { WriterModule } from './writer.module';
import { CreateWriterDto, WriterService } from './writer.service';

describe('WriterService', () => {
    let writerService: WriterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [WriterModule, AppConfigModule],
        }).compile();

        writerService = module.get<WriterService>(WriterService);
    });

    afterEach(async () => {
        await getConnection().close();
    });

    it('should be defined', () => {
        expect(writerService).toBeDefined();
    });

    describe('create writer', () => {
        it('should throw name must be required', async () => {
            const createWriterDto: CreateWriterDto = {
                name: undefined,
            };
            try {
                await writerService.create(createWriterDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('writer name must be required');
            }
        });
    });
});
