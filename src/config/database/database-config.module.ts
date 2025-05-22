import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigService } from "./database-config.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "./configuration";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration]
        })
    ],
    providers: [DatabaseConfigService],
    exports: [DatabaseConfigService]
})
export class DatabaseConfigModule { }