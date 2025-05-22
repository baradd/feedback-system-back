import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
    constructor(private readonly configService: ConfigService) { }

    get host(): string {
        return this.configService.get<string>('DB_HOST');
    }

    get username(): string {
        return this.configService.get<string>('DB_USERNAME');
    }

    get password(): string {
        return this.configService.get<string>('DB_PASSWORD');
    }

    get type(): string {
        return this.configService.get<string>('DB_TYPE');
    }

    get database(): string {
        return this.configService.get<string>('DB_NAME');
    }

    get port(): number {
        return this.configService.get<number>('DB_PORT');
    }

    get synchronize(): boolean {
        return this.configService.get<boolean>('DB_SYNC', false);
    }
}
