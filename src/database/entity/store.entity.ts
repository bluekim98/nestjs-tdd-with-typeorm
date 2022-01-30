import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { StoreItem } from './store-item.entity';

@Entity({ name: 'store' })
export class Store {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id?: number;

    @Column({ name: 'name', type: 'varchar', unique: true })
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

    @OneToMany(() => StoreItem, (storeItem) => storeItem.store)
    @JoinColumn({ name: 'id', referencedColumnName: 'storeId' })
    storeItems?: StoreItem[];
}
