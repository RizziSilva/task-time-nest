import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task, TaskTime, User } from '../entities';

// TODO silva.william 16/01/2024: Achar uma maneira de utilizar a mesma config para o modulo do nestjs e o JSON das migrations.
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  configService: ConfigService = new ConfigService();

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_SERVER'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: [User, Task, TaskTime],
      synchronize: false,
    };
  }
}
