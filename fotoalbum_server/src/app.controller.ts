import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ImageDto } from './dto/image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthProxy } from './auth_proxy/auth-proxy.service';
import { emitWarning } from 'process';
import { AuthGuard } from './guards/auth.guard';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authProxy: AuthProxy,
  ) { }

  @Post("image")
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() data: ImageDto) {
    console.log("uploaded file:", file);

    return this.appService.uploadImage(file, data)
  }

  @Get("images")
  async getImages() {
    return this.appService.getImages();
  }

  @Post('auth/register')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authProxy.register(createUserDto);
  }

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    const res = await this.authProxy.login(loginDto);
    console.log("Res: " + res)
    return res;
  }

  @UseGuards(AuthGuard)
  @Get("auth/me")
  getMe(@Req() req) {
    return req.user;
  }

}
