import { Inject, Injectable } from '@nestjs/common';
import { ImageDto } from './dto/image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { StorageService } from './storage/minio.service';

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
        @Inject() private readonly storageService: StorageService,
    ){}

    async uploadImage(file: Express.Multer.File, data: ImageDto){
        //Step 1.: upload to the storage
        const fileName = await this.storageService.uploadFile(
            file.originalname,
            file.buffer,
            file.mimetype
        );

        //Step 2.: Store the metadata in the DB
        const image = await this.imageRepository.create({
            fileName: fileName,
            name: data.name,
            //date automatically generated
        });
        await this.imageRepository.save(image);
    }

    //TODO: For now, let's get all images... :D
    async getImages(){
        return this.imageRepository.find();
    }
}
