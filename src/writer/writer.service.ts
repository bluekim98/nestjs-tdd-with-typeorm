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

    async create(dto: CreateWriterDto): Promise<Writer> {
        if (!dto.name) throw new Error('writer name must be required');
        return await this.writerRepository.save(dto);
    }
}
