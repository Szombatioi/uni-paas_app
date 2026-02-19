import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { AuthProxy } from "./auth-proxy.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [AuthProxy],
  exports: [AuthProxy],
})
export class AuthProxyModule {}