import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { StoreItem } from './store-item.entity';

@Entity({ name: 'writer' })
export class Writer {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id?: number;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

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

    @OneToMany(() => Book, (book) => book.writer)
    @JoinColumn({ name: 'id', referencedColumnName: 'writerId' })
    books?: Book[];

    @OneToMany(() => StoreItem, (storeItem) => storeItem.store)
    @JoinColumn({ name: 'id', referencedColumnName: 'writerId' })
    storeItems?: StoreItem[];
}
