import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Store } from './store.entity';
import { Writer } from './writer.entity';

@Entity({ name: 'store_item' })
export class StoreItem {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id?: number;

    @Column({ name: 'store_id', type: 'int' })
    storeId: number;

    @Column({ name: 'book_id', type: 'int' })
    bookId: number;

    @Column({ name: 'writer_id', type: 'int' })
    writerId: number;

    @ManyToOne(() => Store, (store) => store.storeItems)
    @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
    store?: Store;

    @ManyToOne(() => Book, (book) => book.storeItems)
    @JoinColumn({ name: 'book_id', referencedColumnName: 'id' })
    book?: Book;

    @ManyToOne(() => Writer, (writer) => writer.storeItems)
    @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
    writer?: Writer;
}
