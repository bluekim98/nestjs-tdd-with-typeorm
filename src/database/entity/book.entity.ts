import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Writer } from './writer.entity';

@Entity({ name: 'book' })
export class Book {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id?: number;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'writer_id', type: 'int' })
    writerId: number;

    @CreateDateColumn({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP(6)',
        name: 'create_at',
    })
    createdAt?: Date;

    @UpdateDateColumn({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
        name: 'update_at',
    })
    updatedAt?: Date;

    @ManyToOne(() => Writer, (writer) => writer.books)
    @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
    writer: Writer;
}
