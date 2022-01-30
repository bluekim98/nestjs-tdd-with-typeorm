import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigModule } from '@src/app-config/app-config.module';
import { getConnection } from 'typeorm';
import { WriterModule } from '../writer.module';
import { CreateWriterDto, WriterService } from './writer.service';
import Chance from 'chance';
import { Writer } from '@src/database/entity/writer.entity';

describe('WriterService', () => {
    let writerService: WriterService;
    const chance = new Chance();

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
        const writerId = chance.integer({ min: 0, max: 100 });
        const name = chance.name();
        const writer: Writer = {
            id: writerId,
            name,
        };

        it('should throw name must be required', async () => {
            const createWriterDto: CreateWriterDto = {
                name: undefined,
            };
            try {
                await writerService.createWriter(createWriterDto);
            } catch (error) {
                expect(() => {
                    throw error;
                }).toThrowError('writer name must be required');
            }
        });

        it('should be created writer', async () => {
            const spyFn = jest.spyOn(WriterService.prototype as any, 'create');
            spyFn.mockImplementation(async () => writer);

            const createWriterDto: CreateWriterDto = {
                name,
            };
            const createWriter = await writerService.createWriter(
                createWriterDto,
            );

            expect(spyFn).toBeCalledTimes(1);
            expect(createWriter).toBeDefined();
            expect(createWriter).toEqual(writer);
        });
    });
});
