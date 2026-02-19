import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { CreateUserDto } from "src/dto/create-user.dto";
import { LoginDto } from "src/dto/login.dto";

@Injectable()
export class AuthProxy {
    private readonly baseUrl: string;
    constructor(private readonly httpService: HttpService,
        private configService: ConfigService
    ) {

        this.baseUrl = this.configService.get<string>("AUTH_ENDPOINT", "http://localhost:8888")
    }

    async login(data: LoginDto): Promise<any> {
        try {
            const res = await firstValueFrom(
                await this.httpService.post(`${this.baseUrl}/login`, data)
            );

            return res.data;
        } catch (err: any) {
            throw new HttpException(err.response?.data || 'Login failed', err.response?.status || 500);
        }
    }

    async register(data: CreateUserDto) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}/register`, {...data, username: data.email})
            );
            console.log(response.data)
            return response.data;
        } catch (err: any) {
            throw new HttpException(
                err.response?.data || 'Registration failed',
                err.response?.status || 500
            );
        }
    }
}