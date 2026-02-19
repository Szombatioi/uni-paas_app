import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageModule } from './storage/minio.module';
import { Image } from './entities/image.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthProxy } from './auth_proxy/auth-proxy.service';
import { AuthProxyModule } from './auth_proxy/auth-proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        // console.log('JWT_SECRET loaded:', secret ? 'YES (exists)' : 'NO (undefined)'); 
        return {
          secret: secret,
          signOptions: { expiresIn: '48h' },
        };
      },
    }),
    StorageModule,
    AuthProxyModule,
    TypeOrmModule.forFeature([Image])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
