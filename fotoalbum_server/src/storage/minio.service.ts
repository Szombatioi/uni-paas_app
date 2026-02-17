import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
import { NotFoundError } from "rxjs";

@Injectable()
export class StorageService {
    private minioClient: Minio.Client;
    private readonly bucketName: string;
    private readonly endpoint: string;

    constructor(private configService: ConfigService) {
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>('MINIO_ENDPOINT')!,
            port: this.configService.get<number>('MINIO_PORT'),
            useSSL: this.configService.get<string>('MINIO_USE_SSL')! === 'true',
            accessKey: this.configService.get<string>('MINIO_ACCESS'),
            secretKey: this.configService.get<string>('MINIO_SECRET'),
            //region: 'auto'
        });

        //We will only use one bucket for all images
        this.bucketName = this.configService.get<string>('MINIO_BUCKET')!;
        this.ensureBucketExists();

        this.endpoint = this.configService.get<string>('MINIO_ENDPOINT')!;
    }

    //Checking if bucket exists, if not, create it
    private async ensureBucketExists() {
        const exists = await this.minioClient.bucketExists(this.bucketName);
        if (!exists) {
            await this.minioClient.makeBucket(this.bucketName);
        }
    }


    async uploadFile(fileName: string, file: Buffer, mimeType: string){
        //All files must be of type image
        if (!mimeType.startsWith('image/')) {
            throw new BadRequestException('Only image files are allowed');
        }

        //Creating a unique name to avoid conflicts
        const storedName = fileName + new Date().getTime();
        await this.minioClient.putObject(
            this.bucketName, 
            storedName,
            file, 
            file.length,
            {'Content-Type': mimeType}
        );

        return storedName;
    }

    async downloadFile(fileName: string){
        try{
            // Check if file exsits
            await this.minioClient.statObject(this.bucketName, fileName);

            const stream = await this.minioClient.getObject(this.bucketName, fileName);
            return stream;
        } catch (err) {
            throw new NotFoundException('File not found: ' + fileName);
        }
    }

    async deleteFile(fileName: string){
        await this.minioClient.removeObject(this.bucketName, fileName);
    }
}