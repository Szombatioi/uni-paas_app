import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Image {
    //We manually set the id by the filename!!
    //The flow is like this: 
        //When uploading a file, we first upload it to minio
        //Then we create the image entity with the unique filename
    @PrimaryColumn('uuid')
    fileName: string; 

    @Column({unique: false, nullable: false})
    name: string;

    @CreateDateColumn()
    date: Date; //TODO check: does this store date + time?
}