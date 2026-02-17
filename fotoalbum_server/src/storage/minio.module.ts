import { ConfigModule } from "@nestjs/config";
import { StorageService } from "./minio.service";
import { Module } from "@nestjs/common";
import { StorageController } from "./minio.controller";

@Module({
  imports: [ConfigModule],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}