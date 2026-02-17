//TEST! TODO: delete this controller!
//Reuse parameters from endpoints
import { Controller, Get, UploadedFile, Post, UseInterceptors, Param, Delete, Res } from '@nestjs/common';
import type { Response } from 'express';
import { StorageService } from './minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {
    constructor(private storageService: StorageService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const url = await this.storageService.uploadFile(file.originalname, file.buffer, file.mimetype);
        return { url };
    }

    @Get(':filename')
    async downloadImage(
        @Param('filename') filename: string,
        @Res() res: Response
    ) {
        try {
            const stream = await this.storageService.downloadFile(filename);


            //For opening
            res.setHeader('Content-Type', 'image/png');
            stream.pipe(res);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    @Delete(':filename')
    async deleteImage(@Param('filename') filename: string) {
        await this.storageService.deleteFile(filename);
        return { message: 'File deleted successfully' };
    }
}

