import { Inject, Injectable } from '@nestjs/common';
import { Writer } from '@src/database/entity/writer.entity';
import { Repository } from 'typeorm';

export class CreateWriterDto {
    readonly name: string;
}

@Injectable()
export class WriterService {
    constructor(
        @Inject('WRITER_REPOSITORY')
        private readonly writerRepository: Repository<Writer>,
    ) {}

    async createWriter({ name }: CreateWriterDto): Promise<Writer> {
        if (!name) throw new Error('writer name must be required');

        const writer: Writer = {
            name,
        };
        return await this.create(writer);
    }

    private async create(writer: Writer): Promise<Writer> {
        return await this.writerRepository.save(writer);
    }

    async findById(id: number): Promise<Writer> {
        return await this.writerRepository.findOne({ id });
    }
}
