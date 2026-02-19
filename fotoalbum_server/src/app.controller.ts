import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ImageDto } from './dto/image.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("image")
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() data: ImageDto){
    return this.appService.uploadImage(file, data)
  }

  @Get("images")
  async getImages(){
    return this.appService.getImages();
  }

}
