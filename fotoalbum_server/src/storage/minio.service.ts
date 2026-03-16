import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { NotFoundError } from 'rxjs';

@Injectable()
export class StorageService {
  // private blobServiceClient: BlobServiceClient;
  // private containerName = 'fotoalbum-images';
  // private containerClient: ContainerClient;

  // constructor(private configService: ConfigService) {
  //     const connectionString = this.configService.get<string>('AZURE_STORAGE_CONNECTION_STRING')!;
  //     this.containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME')!;

  //     this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  //     this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);

  //     this.containerClient.createIfNotExists().then(() => {
  //         console.log(`Container "${this.containerName}" is ready.`);
  //     }).catch(err => {
  //         console.error(`Error creating container: ${err.message}`);
  //     });
  // }
  private minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly endpoint: string;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('S3_ENDPOINT')!,
      port: 443,//this.configService.get<number>('S3_PORT'),
      useSSL: true, //this.configService.get<string>('S3_USE_SSL')! === 'true',
      accessKey: this.configService.get<string>('S3_ACCESS_KEY')!,
      secretKey: this.configService.get<string>('S3_SECRET_KEY')!,
      region: 'auto',
      pathStyle: true,
    });

    //We will only use one bucket for all images
    this.bucketName = this.configService.get<string>('S3_BUCKET')!;
    // this.ensureBucketExists();
    // this.makeBucketPublic(this.bucketName);
  }

  //Checking if bucket exists, if not, create it
  // private async ensureBucketExists() {
  //     const exists = await this.minioClient.bucketExists(this.bucketName);
  //     if (!exists) {
  //         await this.minioClient.makeBucket(this.bucketName);
  //     }
  // }

  // private async makeBucketPublic(bucketName: string) {
  //     const policy = {
  //         Version: '2012-10-17',
  //         Statement: [
  //             {
  //                 Effect: 'Allow',
  //                 Principal: { AWS: ['*'] },
  //                 Action: ['s3:GetObject'],
  //                 Resource: [`arn:aws:s3:::${bucketName}/*`],
  //             },
  //         ],
  //     };

  //     try {
  //         await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
  //         console.log(`Bucket "${bucketName}" is now public.`);
  //     } catch (err) {
  //         console.error('Error setting bucket policy:', err);
  //     }
  // }

  async uploadFile(fileName: string, file: Buffer, mimeType: string) {
    //All files must be of type image
    if (!mimeType.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const timestamp = Date.now();
    const lastDotIndex = fileName.lastIndexOf('.');
    const namePart = fileName.substring(0, lastDotIndex);
    const extPart = fileName.substring(lastDotIndex);

    const storedName = `${namePart}_${timestamp}${extPart}`;

    // const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    // const blobName = storedName; //TODO: this is just a test
    // const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    try {
      await this.minioClient.putObject(
        this.bucketName,
        storedName,
        file,
        file.length,
        { 'Content-Type': mimeType },
      );

      // await blockBlobClient.uploadData(
      //     file,
      //     {
      //         blobHTTPHeaders: { blobContentType: mimeType },
      //     });

      // await this.minioClient.putObject(
      //     this.bucketName,
      //     storedName,
      //     file,
      //     file.length,
      //     { 'Content-Type': mimeType }
      // );

      return storedName;
    } catch (err) {
      console.error('FULL CLOUDFLARE ERROR:', err.message, err.code);
      throw err;
    }
  }

  async downloadFile(fileName: string) {
    // try {
    //     const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    //     const blobClient = containerClient.getBlobClient(fileName);

    //     // Check if file exists (Azure equivalent of statObject)
    //     const exists = await blobClient.exists();
    //     if (!exists) {
    //         throw new NotFoundException('File not found: ' + fileName);
    //     }

    //     // Azure returns a download response; 'readableStreamBody' is the stream
    //     const downloadResponse = await blobClient.download();
    //     return downloadResponse.readableStreamBody;
    // } catch (err) {
    //     if (err instanceof NotFoundException) throw err;
    //     throw new NotFoundException('File not found: ' + fileName);
    // }
    try {
      // Check if file exsits
      await this.minioClient.statObject(this.bucketName, fileName);

      const stream = await this.minioClient.getObject(
        this.bucketName,
        fileName,
      );
      return stream;
    } catch (err) {
      throw new NotFoundException('File not found: ' + fileName);
    }
  }

  async deleteFile(fileName: string) {
    // const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    // const blobClient = containerClient.getBlobClient(fileName);

    // // DeleteIfExists prevents errors if the file was already gone
    // await blobClient.deleteIfExists();
    await this.minioClient.removeObject(this.bucketName, fileName);
  }
}
