import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService, UserModule } from '@modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './environment/env.development',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UserModule,
  ],
})
export class AppModule {}
