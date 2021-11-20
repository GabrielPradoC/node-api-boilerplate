import { Entity, Column, BaseEntity, ObjectID, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Application extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: ObjectID;

    @Column({ unique: true })
    public key: string;

    @Column({ unique: true })
    public label: string;
}
