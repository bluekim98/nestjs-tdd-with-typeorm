import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from './store.entity';
import { Writer } from './writer.entity';

@Entity({ name: 'store_writer_relation' })
export class StoreWriterRelation {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number;

    @Column({ name: 'store_id', type: 'int' })
    storeId: number;

    @Column({ name: 'writer_id', type: 'int' })
    writerId: number;

    @ManyToOne(() => Store, (store) => store.storeWriterRelaions)
    @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
    store: Store;

    @ManyToOne(() => Writer, (writer) => writer.storeWriterRelaions)
    @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
    writer: Writer;
}
