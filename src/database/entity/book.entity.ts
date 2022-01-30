import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { StoreItem } from './store-item.entity';
import { Writer } from './writer.entity';

@Entity({ name: 'book' })
export class Book {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id?: number;

    @Column({ name: 'title', type: 'varchar' })
    title: string;

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
    writer?: Writer;

    @OneToMany(() => StoreItem, (storeItem) => storeItem.book)
    @JoinColumn({ name: 'id', referencedColumnName: 'bookId' })
    storeItems?: StoreItem[];
}
