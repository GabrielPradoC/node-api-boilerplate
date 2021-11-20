import { Entity, ObjectID, Column, BeforeInsert, BeforeUpdate, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: ObjectID;

    @Column({ unique: true })
    public name: string;

    @Column()
    public email: string;

    @Column()
    public phoneNumber: string;

    @Column()
    public isActive: boolean;

    @Column()
    public createdAt: Date;

    @Column()
    public updatedAt: Date;

    @BeforeInsert()
    public setCreateDate(): void {
        this.createdAt = new Date();
    }

    @BeforeInsert()
    @BeforeUpdate()
    public setUpdateDate(): void {
        this.updatedAt = new Date();
    }
}
