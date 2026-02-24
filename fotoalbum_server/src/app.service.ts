import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ImageDto } from './dto/image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { StorageService } from './storage/minio.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    //e.g. localhost:9000/bucket/ -> after this we only need to specify filename to load images
    private readonly objectStorageUrlPrefix;
    
    constructor(
        @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
        @Inject() private readonly storageService: StorageService,
        private configService: ConfigService
    ){
        const s3Protocol = this.configService.get<string>('MINIO_PROTOCOL')!;
        const s3Url = this.configService.get<string>('MINIO_ENDPOINT')!;
        const s3Port = this.configService.get<string>('MINIO_PORT')!;
        const bucketName = this.configService.get<string>('MINIO_BUCKET')!
        this.objectStorageUrlPrefix = `${s3Protocol}://${s3Url}:${s3Port}/${bucketName}/`;
    }

    async uploadImage(file: Express.Multer.File, data: ImageDto){
        if(data.name.length > 40) throw new BadRequestException("image_name_too_long");

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
        const imageRecords = await this.imageRepository.find();
        return {
            urlPrefix: this.objectStorageUrlPrefix, //string
            images: imageRecords                    //Image[]
        };
    }

    async removeImage(fileName: string){
        const record = await this.imageRepository.findOneBy({fileName});
        if(!record){
            throw new NotFoundException("Image not found with file name: " + fileName);
        }
        
        //Remove from the object storage
        await this.storageService.deleteFile(fileName);

        //Remove entry from DB
        this.imageRepository.remove(record);
    }

    // async downloadSome(fileNames: string[]){
    //     const downloadPromises = fileNames.map(f => this.storageService.downloadFile(f));
    //     return await Promise.all(downloadPromises);
    // }
}
