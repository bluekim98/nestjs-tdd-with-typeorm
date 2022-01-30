import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { StoreWriterRelation } from './store-writer-relation.entity';

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

    @OneToMany(
        () => StoreWriterRelation,
        (storeWriterRelation) => storeWriterRelation.store,
    )
    @JoinColumn({ name: 'id', referencedColumnName: 'storeId' })
    storeWriterRelaions?: StoreWriterRelation[];
}
